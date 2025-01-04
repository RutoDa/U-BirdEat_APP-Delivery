import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Animated,
  Linking,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, useRef } from "react";
import axiosInstance from "../../global/axios";

const OrderDetail = () => {
  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const loadingAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(loadingAnim, {
          toValue: 450,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(loadingAnim, {
          toValue: -450,
          duration: 0,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };
    animate();
  }, []);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axiosInstance.get(`deliver/orders/${id}/`);
        setOrder(response.data);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
    const intervalId = setInterval(fetchOrder, 3000);
    return () => clearInterval(intervalId);
  }, [id]);

  const getStatusText = (status) => {
    const statusMap = {
      0: { text: "商家製作中", color: "bg-yellow-500 text-black" },
      1: { text: "等待外送中", color: "bg-blue-500 text-white" },
      2: { text: "外送中", color: "bg-purple-500 text-white" },
      3: { text: "已送達", color: "bg-green-500 text-white" },
    };
    return (
      statusMap[status] || {
        text: "未知狀態",
        color: "bg-gray-100 text-gray-800",
      }
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: "訂單資訊" }} />
      <SafeAreaView className="flex-1 bg-white">
        {order != null && order.status < 3 && (
          <Animated.View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 5,
              backgroundColor: "#3b82f6",
              transform: [
                {
                  translateX: loadingAnim,
                },
              ],
            }}
          />
        )}

        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#000000" />
          </View>
        ) : (
          <ScrollView className="flex-1">
            {/* Order Header */}
            <View className="p-4 border-b border-gray-200">
              <Text className="text-2xl font-bold">
                {order.provider.shop_name}
              </Text>
              <View className="flex-row items-center mt-2">
                <Text
                  className={`px-3 py-1 rounded-full ${
                    getStatusText(order.status).color
                  }`}
                >
                  {getStatusText(order.status).text}
                </Text>
              </View>
              <Text className="text-gray-500 mt-1">
                訂單編號：#{order.id.toString().padStart(6, "0")}
              </Text>
            </View>

            {/* Customer Info */}
            <View className="p-4 border-b border-gray-200">
              <Text className="text-lg font-bold mb-2">顧客資訊</Text>
              <Text className="text-gray-700">
                姓名：{order.customer.real_name}
              </Text>
              <Text className="text-gray-700">
                電話：{order.customer.phone}
              </Text>
              <Text className="text-gray-700 mt-2">
                外送地址：{order.delivery_address}
              </Text>
              <Text className="text-gray-700 mt-2">
                Google 地圖：{" "}
                <Text
                  className="text-blue-600"
                  onPress={() => {
                    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      order.delivery_address
                    )}`;
                    Linking.openURL(url);
                  }}
                >
                  查看地圖
                </Text>
              </Text>
            </View>

            {/* Shop Info */}
            <View className="p-4 border-b border-gray-200">
              <Text className="text-lg font-bold mb-2">店家資訊</Text>
              <Text className="text-gray-700">
                店名：{order.provider.shop_name}
              </Text>
              <Text className="text-gray-700">
                地址：{order.provider.address}
              </Text>
              <Text className="text-gray-700 mt-2">
                Google 地圖：{" "}
                <Text
                  className="text-blue-600"
                  onPress={() => {
                    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      order.provider.address
                    )}`;
                    Linking.openURL(url);
                  }}
                >
                  查看地圖
                </Text>
              </Text>
            </View>

            {/* Price Info */}
            <View className="p-4">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-gray-700">商品金額</Text>
                <Text className="font-bold">
                  NT$ {order.total_price - order.delivery_fee}
                </Text>
              </View>
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-gray-700">外送費</Text>
                <Text className="font-bold">NT$ {order.delivery_fee}</Text>
              </View>
              <View className="flex-row justify-between items-center pt-2 border-t border-gray-200">
                <Text className="text-lg font-bold">總金額</Text>
                <Text className="text-xl font-bold text-blue-600">
                  NT$ {order.total_price}
                </Text>
              </View>
            </View>
          </ScrollView>
        )}

        {!isLoading && order.status === 1 && (
          <TouchableOpacity
            onPress={() => {
              axiosInstance
                .put(`deliver/orders/${order.id}/`)
                .then(() => {
                  setOrder({ ...order, status: 2 });
                  Alert.alert("接單成功", "請開始外送");
                })
                .catch((error) => {
                  Alert.alert("接單失敗", "請再試一次");
                  console.error("Error updating order status:", error);
                });
            }}
            className="bg-blue-500 py-3 items-center justify-center"
          >
            <Text className="text-white text-center">接單</Text>
          </TouchableOpacity>
        )}

        {!isLoading && order.status === 2 && (
          <TouchableOpacity
            onPress={() => {
              axiosInstance
                .put(`deliver/orders/${order.id}/`)
                .then(() => {
                  setOrder({ ...order, status: 3 });
                  Alert.alert("送達成功", "訂單已送達");
                })
                .catch((error) => {
                  Alert.alert("送達失敗", "請再試一次");
                  console.error("Error updating order status:", error);
                });
            }}
            className="bg-purple-500 py-3 items-center justify-center"
          >
            <Text className="text-white text-center">送達</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </>
  );
};

export default OrderDetail;
