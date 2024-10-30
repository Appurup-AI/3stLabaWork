import { StatusBar } from "expo-status-bar";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
  TextInput,
} from "react-native";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import { useState, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import { styles } from "./styles";
import { StudentButton, StudentForm, Content } from "./el.js";

async function initializeDatabase(db) {
  try {
    await db.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS students (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                firstName TEXT,
                lastName TEXT,
                age INTEGER,
                email TEXT
            );
        `);
    console.log("Database initialised");
  } catch (error) {
    console.log("Error while initializing database : ", error);
  }
}

export default function App() {
  return (
    <SQLiteProvider databaseName="example.db" onInit={initializeDatabase}>
      <View style={styles.container}>
        <Text style={styles.title}>List of students</Text>
        <Content />
        <StatusBar style="auto" />
      </View>
    </SQLiteProvider>
  );
}
