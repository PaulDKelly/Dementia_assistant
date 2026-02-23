import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ScreenShell from "../components/ScreenShell";
import { colors } from "../theme/colors";

function formatNotificationCount(items) {
  return `${items.length} notification${items.length === 1 ? "" : "s"}`;
}

export default function CompanionDashboardScreen({
  profileName,
  mood,
  nextEvent,
  pendingMeds,
  notifications,
  moments,
  schedule,
  onTalkPress,
  onReadReminders,
  onOpenMoments,
}) {
  return (
    <ScreenShell title="Companion Dashboard">
      <View style={styles.avatarCard}>
        <View style={styles.glowBubbleA} />
        <View style={styles.glowBubbleB} />
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>A</Text>
        </View>
        <View style={styles.avatarBody}>
          <Text style={styles.greeting}>Hi {profileName || "there"}, I am your companion.</Text>
          <Text style={styles.helper}>
            Mood: {mood}. Next up: {nextEvent ? `${nextEvent.time} - ${nextEvent.title}` : "No events today"}.
          </Text>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity onPress={onTalkPress} style={styles.primaryAction}>
          <Text style={styles.actionLabel}>Talk to me</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onReadReminders} style={styles.secondaryAction}>
          <Text style={styles.secondaryLabel}>Read reminders</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.cardTitle}>Today notifications</Text>
          <Text style={styles.badge}>{formatNotificationCount(notifications)}</Text>
        </View>
        {notifications.length === 0 ? (
          <Text style={styles.emptyText}>No alerts right now.</Text>
        ) : (
          notifications.map((item, idx) => (
            <View key={item.id} style={styles.notificationRow}>
              <View style={[styles.dot, idx % 2 ? styles.dotAlt : null]} />
              <Text style={styles.notificationText}>{item.message}</Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Upcoming today</Text>
        {schedule.slice(0, 4).map((item) => (
          <View key={item.id} style={styles.timelineRow}>
            <Text style={styles.timelineTime}>{item.time}</Text>
            <Text style={styles.timelineText}>{item.title}</Text>
          </View>
        ))}
        {pendingMeds > 0 ? (
          <Text style={styles.pendingText}>{pendingMeds} medication item(s) still pending.</Text>
        ) : (
          <Text style={styles.doneText}>All medications marked as logged today.</Text>
        )}
      </View>

      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.cardTitle}>Family photos</Text>
          <TouchableOpacity onPress={onOpenMoments}>
            <Text style={styles.link}>Open all</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.photoRow}>
          {moments.slice(0, 3).map((moment) => (
            <View key={moment.id} style={styles.photoTile}>
              <Text style={styles.photoType}>{moment.type.toUpperCase()}</Text>
              <Text style={styles.photoCaption} numberOfLines={2}>
                {moment.caption}
              </Text>
            </View>
          ))}
          {moments.length === 0 ? <Text style={styles.emptyText}>No family moments yet.</Text> : null}
        </View>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  avatarCard: {
    backgroundColor: "#FFFDFB",
    borderColor: "#F4D8CF",
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  glowBubbleA: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FFE4F0",
    right: -28,
    top: -42,
  },
  glowBubbleB: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#DDF6EE",
    right: 24,
    bottom: -20,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFF0F7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  avatarText: {
    color: colors.accent,
    fontWeight: "800",
    fontSize: 30,
  },
  avatarBody: {
    flex: 1,
  },
  greeting: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 4,
  },
  helper: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  actionsRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  primaryAction: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: colors.accent,
    paddingVertical: 13,
    alignItems: "center",
    marginRight: 8,
  },
  secondaryAction: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: "#F4FFFC",
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingVertical: 12,
    alignItems: "center",
  },
  actionLabel: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  secondaryLabel: {
    color: colors.textPrimary,
    fontWeight: "700",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#FFFDFB",
    borderColor: "#F1D7CE",
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontWeight: "700",
    fontSize: 17,
  },
  badge: {
    color: colors.accent,
    fontWeight: "700",
    fontSize: 13,
  },
  notificationRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#F5E7E1",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
    marginRight: 8,
  },
  dotAlt: {
    backgroundColor: colors.accentAlt,
  },
  notificationText: {
    color: colors.textPrimary,
    fontSize: 15,
    flex: 1,
  },
  timelineRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  timelineTime: {
    minWidth: 72,
    color: colors.accent,
    fontWeight: "700",
  },
  timelineText: {
    color: colors.textPrimary,
    fontSize: 15,
  },
  pendingText: {
    marginTop: 8,
    color: "#B45309",
    fontWeight: "700",
  },
  doneText: {
    marginTop: 8,
    color: colors.success,
    fontWeight: "700",
  },
  photoRow: {
    flexDirection: "row",
    gap: 8,
  },
  photoTile: {
    flex: 1,
    minHeight: 84,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EBCFC6",
    padding: 8,
    backgroundColor: "#FFF8F5",
  },
  photoType: {
    color: colors.accent,
    fontWeight: "800",
    fontSize: 11,
    marginBottom: 6,
  },
  photoCaption: {
    color: colors.textPrimary,
    fontSize: 13,
  },
  link: {
    color: colors.accent,
    fontWeight: "700",
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
  },
});
