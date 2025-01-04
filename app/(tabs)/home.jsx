import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import axiosInstance from "../../global/axios";
import { OrderCard } from "../../components";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("deliver/orders/");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders data:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => {
      fetchOrders();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="flex items-center justify-center h-full">
          {/* LOGO */}
          <Text className="text-5xl font-semibold text-black pt-5 text-center font-psemibold">
            U-Bird Eats
          </Text>

          {/* Order List Title */}
          <View className="flex-row justify-center w-full px-4 mt-4">
            <Text className="text-lg font-semibold text-black">
              訂單列表 (即時更新)
            </Text>
          </View>

          {/* Order List */}
          {!isLoading && (
            <View className="w-full items-center justify-center mt-6">
              {orders.map((order) => (
                <OrderCard
                  key={order.id}
                  oid={order.id}
                  delivery_fee={order.delivery_fee}
                  delivery_address={order.delivery_address}
                  created_at={order.created_at}
                />
              ))}
            </View>
          )}

          {/* Loader */}
          {isLoading && (
            <View className="container flex justify-center items-center mt-20 pt-20">
              <ActivityIndicator animating={isLoading} color="#000" size="50" />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
