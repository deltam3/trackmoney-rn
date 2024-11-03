import * as React from "react";
import { Text, View } from "react-native";
import { Category, Transaction } from "../types";
import { useSQLiteContext } from "expo-sqlite";

export default function Home() {
  const [categories, setCategories] = React.useState<Category[]>();
  const [transactions, setTransactions] = React.useState<Transaction[]>();

  const db = useSQLiteContext();

  return (
    <View>
      <Text>Home Screen</Text>
    </View>
  );
}
