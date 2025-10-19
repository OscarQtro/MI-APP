import AsyncStorage from "@react-native-async-storage/async-storage";
export async function setProgress(userId: string, activityId: string, value: any) {
  await AsyncStorage.setItem(`progress:${userId}:${activityId}`, JSON.stringify(value));
}
export async function getProgress<T=any>(userId: string, activityId: string): Promise<T | null> {
  const v = await AsyncStorage.getItem(`progress:${userId}:${activityId}`);
  return v ? JSON.parse(v) as T : null;
}
