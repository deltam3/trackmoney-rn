import * as React from "react";
import {
  Button,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Card from "./ui/Card";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useSQLiteContext } from "expo-sqlite/next";
import { Category, Transaction } from "../types";
import { transCategoryNames } from "../constants";

export default function AddTransaction({
  insertTransaction,
}: {
  insertTransaction(transaction: Transaction): Promise<void>;
}) {
  const [isAddingTransaction, setIsAddingTransaction] =
    React.useState<boolean>(false);
  const [currentTab, setCurrentTab] = React.useState<number>(0);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [typeSelected, setTypeSelected] = React.useState<string>("");
  const [amount, setAmount] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [category, setCategory] = React.useState<string>("Expense");
  const [categoryId, setCategoryId] = React.useState<number>(1);
  const db = useSQLiteContext();

  React.useEffect(() => {
    getExpenseType(currentTab);
  }, [currentTab]);

  async function getExpenseType(currentTab: number) {
    setCategory(currentTab === 0 ? "Expense" : "Income");
    const type = currentTab === 0 ? "Expense" : "Income";

    const result = await db.getAllAsync<Category>(
      `SELECT * FROM Categories WHERE type = ?;`,
      [type]
    );

    setCategories(result);
  }

  async function handleSave() {
    // @ts-ignore
    await insertTransaction({
      amount: Number(amount),
      description,
      category_id: categoryId,
      date: new Date().toISOString(),
      type: category as "Expense" | "Income",
    });
    setAmount("");
    setDescription("");
    setCategory("Expense");
    setCategoryId(1);
    setCurrentTab(0);
    setIsAddingTransaction(false);
  }

  const renderCategoryItem = ({ item }: { item: Category }) => {
    return (
      <CategoryButton
        key={item.id}
        id={item.id}
        title={transCategoryNames[item.name] || item.name}
        isSelected={typeSelected === transCategoryNames[item.name]}
        setTypeSelected={setTypeSelected}
        setCategoryId={setCategoryId}
      />
    );
  };

  return (
    <View style={{ marginBottom: 15 }}>
      {isAddingTransaction ? (
        <View>
          <Card>
            <TextInput
              placeholder="금액"
              style={{ fontSize: 32, marginBottom: 15, fontWeight: "bold" }}
              keyboardType="numeric"
              onChangeText={(text) => {
                const numericValue = text.replace(/[^0-9.]/g, "");
                setAmount(numericValue);
              }}
            />
            <TextInput
              placeholder="설명"
              style={{ marginBottom: 15 }}
              onChangeText={setDescription}
            />
            <Text style={{ marginBottom: 6 }}>
              수입아니면 지출을 선택해주세요.
            </Text>
            <SegmentedControl
              values={["지출", "수입"]}
              style={{ marginBottom: 15 }}
              selectedIndex={currentTab}
              onChange={(event) => {
                setCurrentTab(event.nativeEvent.selectedSegmentIndex);
              }}
            />
            <FlatList
              data={categories}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderCategoryItem}
              ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
            />
          </Card>
          <View
            style={{ flexDirection: "row", justifyContent: "space-around" }}
          >
            <Button
              title="취소"
              color="red"
              onPress={() => setIsAddingTransaction(false)}
            />
            <Button title="저장" onPress={handleSave} />
          </View>
        </View>
      ) : (
        <AddButton setIsAddingTransaction={setIsAddingTransaction} />
      )}
    </View>
  );
}

function CategoryButton({
  id,
  title,
  isSelected,
  setTypeSelected,
  setCategoryId,
}: {
  id: number;
  title: string;
  isSelected: boolean;
  setTypeSelected: React.Dispatch<React.SetStateAction<string>>;
  setCategoryId: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <TouchableOpacity
      onPress={() => {
        setTypeSelected(title);
        setCategoryId(id);
      }}
      activeOpacity={0.6}
      style={{
        height: 40,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: isSelected ? "#007BFF20" : "#00000020",
        borderRadius: 15,
        marginBottom: 6,
      }}
    >
      <Text
        style={{
          fontWeight: "700",
          color: isSelected ? "#007BFF" : "#000000",
          marginLeft: 5,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

function AddButton({
  setIsAddingTransaction,
}: {
  setIsAddingTransaction: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <TouchableOpacity
      onPress={() => setIsAddingTransaction(true)}
      activeOpacity={0.6}
      style={{
        height: 40,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#007BFF20",
        borderRadius: 15,
      }}
    >
      <MaterialIcons name="add-circle-outline" size={24} color="#007BFF" />
      <Text style={{ fontWeight: "700", color: "#007BFF", marginLeft: 5 }}>
        새로운 기록 추가하기
      </Text>
    </TouchableOpacity>
  );
}
