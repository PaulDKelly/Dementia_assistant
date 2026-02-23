import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../theme/colors";

export default function BottomTabs({ tabs, activeTab, onSelect }) {
  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          accessibilityRole="button"
          accessibilityLabel={`Open ${tab}`}
          accessibilityState={{ selected: activeTab === tab }}
          onPress={() => onSelect(tab)}
          style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
        >
          <Text style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>{tab}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: colors.tabBackground,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 20,
    shadowColor: "#D7AFA2",
    shadowOpacity: 0.28,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 3,
    paddingVertical: 11,
    borderRadius: 14,
    alignItems: "center",
  },
  tabButtonActive: {
    backgroundColor: colors.accent,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  tabLabelActive: {
    color: "#FFFFFF",
  },
});
