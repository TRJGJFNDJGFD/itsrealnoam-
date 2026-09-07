package net.legendil.status;

import com.google.inject.Inject;
import com.velocitypowered.api.event.Subscribe;
import com.velocitypowered.api.event.proxy.ProxyInitializeEvent;
import com.velocitypowered.api.plugin.Plugin;
import com.velocitypowered.api.plugin.annotation.DataDirectory;
import com.velocitypowered.api.proxy.ProxyServer;
import org.slf4j.Logger;

import java.nio.file.Path;
import java.util.concurrent.TimeUnit;

@Plugin(
        id = "legendil-status",
        name = "Legend-IL Status",
        version = "1.0.0",
        description = "Reports live network status to the Legend-IL Status API.",
        authors = {"Legend-IL"}
)
public final class StatusPlugin {

    private final ProxyServer server;
    private final Logger logger;
    private final Path dataDirectory;

    @Inject
    public StatusPlugin(ProxyServer server, Logger logger, @DataDirectory Path dataDirectory) {
        this.server = server;
        this.logger = logger;
        this.dataDirectory = dataDirectory;
    }

    @Subscribe
    public void onProxyInitialize(ProxyInitializeEvent event) {
        StatusConfig config = StatusConfig.loadOrCreate(dataDirectory, logger);
        if (config == null) {
            // loadOrCreate already logged exactly why (missing file just
            // written, or placeholder values still in place).
            return;
        }

        HeartbeatSender heartbeatSender = new HeartbeatSender(server, logger, config);

        server.getScheduler()
                .buildTask(this, heartbeatSender::sendHeartbeat)
                .repeat(config.heartbeatIntervalSeconds(), TimeUnit.SECONDS)
                .schedule();

        logger.info(
                "[legendil-status] Sending heartbeats for network '{}' every {}s to {}",
                config.network(),
                config.heartbeatIntervalSeconds(),
                config.apiUrl()
        );
    }
}
