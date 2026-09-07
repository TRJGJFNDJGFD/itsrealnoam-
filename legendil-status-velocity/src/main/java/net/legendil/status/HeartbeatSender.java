package net.legendil.status;

import com.velocitypowered.api.proxy.ProxyServer;
import com.velocitypowered.api.proxy.server.RegisteredServer;
import com.velocitypowered.api.proxy.server.ServerPing;
import org.slf4j.Logger;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

/**
 * Builds one heartbeat from Velocity's live proxy state and POSTs it to
 * the Status API. Every number here comes straight from Velocity's own
 * API — nothing is invented or cached across calls.
 */
public final class HeartbeatSender {

    private final ProxyServer server;
    private final Logger logger;
    private final StatusConfig config;
    private final HttpClient httpClient;

    public HeartbeatSender(ProxyServer server, Logger logger, StatusConfig config) {
        this.server = server;
        this.logger = logger;
        this.config = config;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(4))
                .build();
    }

    public void sendHeartbeat() {
        Collection<RegisteredServer> registeredServers = server.getAllServers();
        List<CompletableFuture<ServerSnapshot>> futures = new ArrayList<>(registeredServers.size());

        for (RegisteredServer registered : registeredServers) {
            futures.add(pingServer(registered));
        }

        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]))
                .orTimeout(6, TimeUnit.SECONDS)
                .handle((ignored, timeoutError) -> futures.stream()
                        .map(f -> f.getNow(null))
                        .filter(Objects::nonNull)
                        .toList())
                .thenAccept(this::publish)
                .exceptionally(error -> {
                    logger.warn("[legendil-status] Failed to collect server snapshots: {}", error.getMessage());
                    return null;
                });
    }

    /**
     * A real query (not just "who's currently proxied through us") is what
     * actually tells us a backend server is reachable — a server with zero
     * connected players still needs to report "online" if it responds.
     */
    private CompletableFuture<ServerSnapshot> pingServer(RegisteredServer registered) {
        String name = registered.getServerInfo().getName();
        int connectedPlayers = registered.getPlayersConnected().size();

        return registered.ping()
                .thenApply(ping -> {
                    int maxPlayers = ping.getPlayers().map(ServerPing.Players::getMax).orElse(0);
                    int onlinePlayers = ping.getPlayers().map(ServerPing.Players::getOnline).orElse(connectedPlayers);
                    return new ServerSnapshot(name, true, onlinePlayers, maxPlayers);
                })
                .exceptionally(error -> new ServerSnapshot(name, false, 0, 0));
    }

    private void publish(List<ServerSnapshot> snapshots) {
        int totalPlayers = server.getPlayerCount();
        String json = HeartbeatJson.build(config.network(), Instant.now(), snapshots, totalPlayers);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(config.apiUrl()))
                .timeout(Duration.ofSeconds(5))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + config.apiToken())
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .build();

        httpClient.sendAsync(request, HttpResponse.BodyHandlers.discarding())
                .thenAccept(response -> {
                    if (response.statusCode() != 200) {
                        logger.warn("[legendil-status] Heartbeat rejected: HTTP {}", response.statusCode());
                    }
                })
                .exceptionally(error -> {
                    logger.warn("[legendil-status] Failed to send heartbeat: {}", error.getMessage());
                    return null;
                });
    }
}
