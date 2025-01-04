import {
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import axiosInstance from "../../global/axios";
import { Stack, useRouter } from "expo-router";
import { OrderCard } from "../../components";

const orders = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [income, setIncome] = useState([]);

  useEffect(() => {
    const fetchIncome = async () => {
      try {
        const response = await axiosInstance.get("deliver/income/");
        setIncome(response.data);
      } catch (error) {
        console.error("Error fetching income data:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIncome();
  }, []);
  return (
    <>
      <Stack.Screen options={{ title: "收入明細" }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#E5E7EB" }}>
        {isLoading ? (
          <ActivityIndicator size="large" style={{ flex: 1 }} />
        ) : (
          <View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                textAlign: "center",
                marginVertical: 16,
              }}
            >
              總收入: {income.total_income}
            </Text>
            <ScrollView>
              {income.orders.map((order) => (
                <TouchableOpacity
                  key={order.id}
                  onPress={() => router.push(`/order/${order.id}`)}
                >
                  <OrderCard
                    key={order.id}
                    oid={order.id}
                    delivery_fee={order.delivery_fee}
                    created_at={order.created_at}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </SafeAreaView>
    </>
  );
};

export default orders;
