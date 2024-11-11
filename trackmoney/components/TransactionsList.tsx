import { FlatList, View, Text, TouchableOpacity } from "react-native";
import { Category, Transaction } from "../types";
import TransactionListItem from "./TransactionListItem";

export default function TransactionsList({
  transactions,
  categories,
  deleteTransaction,
}: {
  categories: Category[];
  transactions: Transaction[];
  deleteTransaction: (id: number) => Promise<void>;
}) {
  const renderItem = ({ item }: { item: Transaction }) => {
    const categoryForCurrentItem = categories.find(
      (category) => category.id === item.category_id
    );

    return (
      <TouchableOpacity
        key={item.id}
        activeOpacity={0.7}
        onLongPress={() => deleteTransaction(item.id)}
      >
        <TransactionListItem
          transaction={item}
          categoryInfo={categoryForCurrentItem}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 0 }}
        ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
      />
    </View>
  );
}
