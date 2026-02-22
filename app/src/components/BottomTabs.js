import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../theme/colors";

export const TABS = ["Home", "Today", "Medication", "Family", "Talk"];

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
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: colors.tabBackground,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 3,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  tabButtonActive: {
    backgroundColor: colors.accent,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  tabLabelActive: {
    color: "#FFFFFF",
  },
});
