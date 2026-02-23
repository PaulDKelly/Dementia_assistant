import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CompanionAvatar from "../components/CompanionAvatar";
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
  speaking,
  onTalkPress,
  onReadReminders,
  onOpenMoments,
}) {
  return (
    <ScreenShell title="Companion Dashboard">
      <View style={styles.heroStage}>
        <View style={styles.stageBubbleA} />
        <View style={styles.stageBubbleB} />
        <View style={styles.stageBubbleC} />

        <View style={styles.avatarCenter}>
          <CompanionAvatar speaking={speaking} />
          <Text style={styles.avatarHint}>{speaking ? "Speaking..." : "Ready to chat"}</Text>
        </View>

        <TouchableOpacity onPress={onTalkPress} style={[styles.cloudButton, styles.cloudTalk]}>
          <Text style={styles.cloudButtonText}>Talk to me</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onReadReminders} style={[styles.cloudButton, styles.cloudReminder]}>
          <Text style={styles.cloudButtonText}>Read reminders</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onOpenMoments} style={[styles.cloudButton, styles.cloudMoments]}>
          <Text style={styles.cloudButtonText}>Family moments</Text>
        </TouchableOpacity>

        <View style={[styles.infoCloud, styles.infoMood]}>
          <Text style={styles.infoLabel}>Mood</Text>
          <Text style={styles.infoValue}>{mood}</Text>
        </View>

        <View style={[styles.infoCloud, styles.infoNext]}>
          <Text style={styles.infoLabel}>Next</Text>
          <Text style={styles.infoValue} numberOfLines={2}>
            {nextEvent ? `${nextEvent.time} ${nextEvent.title}` : "No events today"}
          </Text>
        </View>

        <View style={[styles.infoCloud, styles.infoMeds]}>
          <Text style={styles.infoLabel}>Meds</Text>
          <Text style={styles.infoValue}>{pendingMeds} pending</Text>
        </View>
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
  heroStage: {
    height: 380,
    borderRadius: 24,
    backgroundColor: "#FFF8F4",
    borderWidth: 1,
    borderColor: "#F4D8CF",
    marginBottom: 12,
    position: "relative",
    overflow: "hidden",
  },
  stageBubbleA: {
    position: "absolute",
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: "#FFE4F0",
    left: -40,
    top: -35,
  },
  stageBubbleB: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#E6F8F2",
    right: -20,
    top: 35,
  },
  stageBubbleC: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#FFF1D9",
    right: -45,
    bottom: -55,
  },
  avatarCenter: {
    position: "absolute",
    left: "29%",
    right: "29%",
    top: 88,
    alignItems: "center",
  },
  avatarHint: {
    marginTop: 8,
    color: colors.textSecondary,
    fontWeight: "700",
    fontSize: 13,
  },
  cloudButton: {
    position: "absolute",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E8C9D5",
    backgroundColor: "#FFFFFF",
    shadowColor: "#D9B3A7",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cloudTalk: {
    left: 14,
    top: 112,
    backgroundColor: "#F8D3E1",
  },
  cloudReminder: {
    right: 12,
    top: 116,
    backgroundColor: "#D9F4ED",
  },
  cloudMoments: {
    left: 24,
    bottom: 28,
    backgroundColor: "#FBE9D2",
  },
  cloudButtonText: {
    color: colors.textPrimary,
    fontWeight: "800",
    fontSize: 13,
  },
  infoCloud: {
    position: "absolute",
    minWidth: 90,
    maxWidth: 140,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E9CEC4",
    backgroundColor: "rgba(255,255,255,0.92)",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  infoMood: {
    left: 12,
    top: 30,
  },
  infoNext: {
    right: 10,
    top: 24,
  },
  infoMeds: {
    right: 22,
    bottom: 42,
  },
  infoLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 2,
    textTransform: "uppercase",
  },
  infoValue: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
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
