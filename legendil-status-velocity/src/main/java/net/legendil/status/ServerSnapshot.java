package net.legendil.status;

/** One Velocity-registered server's status at heartbeat time. */
public record ServerSnapshot(String name, boolean online, int players, int maxPlayers) {
}
