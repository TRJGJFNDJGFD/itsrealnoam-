package net.legendil.status;

import org.slf4j.Logger;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Properties;

/**
 * Plugin configuration, loaded from {@code config.properties} in the
 * plugin's data directory. Never hardcode the API token here — it lives
 * only in that file (or wherever you template it from), which stays out
 * of version control.
 */
public record StatusConfig(String network, String apiUrl, String apiToken, int heartbeatIntervalSeconds) {

    private static final String DEFAULT_CONTENT = """
            # Legend-IL Status plugin configuration
            # The network name reported in every heartbeat payload.
            network=legend-il

            # Full URL of your Status API's heartbeat endpoint.
            api-url=https://YOUR-API-DOMAIN/api/v1/heartbeat

            # Shared secret configured on the Status API side (STATUS_API_TOKEN).
            # Never commit this file with a real value in it.
            api-token=change-me

            # How often (in seconds) to send a heartbeat.
            heartbeat-interval=5
            """;

    public static StatusConfig loadOrCreate(Path dataDirectory, Logger logger) {
        try {
            Files.createDirectories(dataDirectory);
            Path configPath = dataDirectory.resolve("config.properties");

            if (Files.notExists(configPath)) {
                Files.writeString(configPath, DEFAULT_CONTENT);
                logger.warn(
                        "[legendil-status] Created default config.properties at {} — set api-url and api-token, then restart the proxy.",
                        configPath
                );
                return null;
            }

            Properties props = new Properties();
            try (InputStream in = Files.newInputStream(configPath)) {
                props.load(in);
            }

            String network = props.getProperty("network", "legend-il").trim();
            String apiUrl = props.getProperty("api-url", "").trim();
            String apiToken = props.getProperty("api-token", "").trim();
            int interval = parseIntOr(props.getProperty("heartbeat-interval"), 5);

            if (apiUrl.isBlank() || apiUrl.contains("YOUR-API-DOMAIN")) {
                logger.warn("[legendil-status] config.properties: api-url is still a placeholder — plugin disabled.");
                return null;
            }
            if (apiToken.isBlank() || apiToken.equals("change-me")) {
                logger.warn("[legendil-status] config.properties: api-token is still a placeholder — plugin disabled.");
                return null;
            }

            return new StatusConfig(network, apiUrl, apiToken, Math.max(1, interval));
        } catch (IOException e) {
            logger.error("[legendil-status] Failed to load config.properties", e);
            return null;
        }
    }

    private static int parseIntOr(String value, int fallback) {
        if (value == null || value.isBlank()) return fallback;
        try {
            return Integer.parseInt(value.trim());
        } catch (NumberFormatException e) {
            return fallback;
        }
    }
}
