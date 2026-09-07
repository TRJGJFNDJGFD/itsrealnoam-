package net.legendil.status;

import java.time.Instant;
import java.util.List;

/**
 * Hand-rolled JSON serialization for the one fixed payload shape this
 * plugin ever sends — avoids depending on a JSON library being present
 * on Velocity's runtime classpath.
 */
final class HeartbeatJson {

    private HeartbeatJson() {
    }

    static String build(String network, Instant timestamp, List<ServerSnapshot> servers, int totalPlayers) {
        StringBuilder sb = new StringBuilder();
        sb.append('{');
        appendStringField(sb, "network", network);
        sb.append(',');
        appendStringField(sb, "timestamp", timestamp.toString());
        sb.append(',');
        sb.append("\"servers\":[");
        for (int i = 0; i < servers.size(); i++) {
            if (i > 0) sb.append(',');
            appendServer(sb, servers.get(i));
        }
        sb.append("],");
        sb.append("\"totalPlayers\":").append(totalPlayers);
        sb.append('}');
        return sb.toString();
    }

    private static void appendServer(StringBuilder sb, ServerSnapshot snapshot) {
        sb.append('{');
        appendStringField(sb, "name", snapshot.name());
        sb.append(',');
        appendStringField(sb, "status", snapshot.online() ? "online" : "offline");
        sb.append(',');
        sb.append("\"players\":").append(snapshot.players());
        sb.append(',');
        sb.append("\"maxPlayers\":").append(snapshot.maxPlayers());
        sb.append('}');
    }

    private static void appendStringField(StringBuilder sb, String key, String value) {
        sb.append('"').append(key).append("\":\"").append(escape(value)).append('"');
    }

    private static String escape(String value) {
        StringBuilder out = new StringBuilder(value.length());
        for (int i = 0; i < value.length(); i++) {
            char c = value.charAt(i);
            switch (c) {
                case '"' -> out.append("\\\"");
                case '\\' -> out.append("\\\\");
                case '\n' -> out.append("\\n");
                case '\r' -> out.append("\\r");
                case '\t' -> out.append("\\t");
                default -> {
                    if (c < 0x20) {
                        out.append(String.format("\\u%04x", (int) c));
                    } else {
                        out.append(c);
                    }
                }
            }
        }
        return out.toString();
    }
}
