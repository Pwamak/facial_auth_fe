import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export default function Home() {
  const route = useRoute();
  const rawUsername = route.params?.username || "User";
  const username = capitalizeFirstLetter(rawUsername);

  // Mock data for demonstration purposes
  const balanceInfo = {
    totalBalance: "$15,734,907.45",
    savingsBalance: "$10,450,654.29",
  };

  const transactions = [
    { id: 1, type: "Deposit", amount: "$5,000", date: "2023-05-20" },
    { id: 2, type: "Withdrawal", amount: "$2,500", date: "2023-05-19" },
    { id: 3, type: "Transfer", amount: "$1,200", date: "2023-05-18" },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Muzan Bank</Text>
      <Text style={styles.subtitle}>Hey {username}</Text>
      <Text style={styles.subtitle}>Welcome to your dashboard</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Available Balance</Text>
        <Text style={styles.balance}>{balanceInfo.totalBalance}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Savings Balance</Text>
        <Text style={styles.balance}>{balanceInfo.savingsBalance}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Transactions</Text>
        {transactions.map((transaction) => (
          <View key={transaction.id} style={styles.transaction}>
            <Text>
              {transaction.date} - {transaction.type}
            </Text>
            <Text>{transaction.amount}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  title: {
    textAlign: "center",
    color: "#007bff",
    fontSize: 24,
    fontWeight: "bold",
    margin: 20,
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    fontSize: 18,
    marginBottom: 20,
  },
  username: {
    textAlign: "center",
    color: "#666",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    margin: 20,
    borderRadius: 8,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  cardTitle: {
    fontSize: 18,
    color: "#007bff",
    marginBottom: 10,
  },
  balance: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  transaction: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 10,
  },
});