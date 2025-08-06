// /// app/(screens)/AdministrationScreen.tsx

// import { Ionicons } from '@expo/vector-icons';
// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   FlatList,
//   Modal,
//   ScrollView,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View
// } from 'react-native';

// const API_BASE = 'http://<your_backend_ip>:5000/api'; // Update this

// const types = ['cpu', 'gpu', 'psu', 'motherboard']; */

// const AdministrationScreen = () => {
//   const [selectedType, setSelectedType] = useState('cpu');
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [editingItem, setEditingItem] = useState(null);
//   const [form, setForm] = useState({});

//   // Fetch data
//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${API_BASE}/${selectedType}`);
//       setItems(res.data || []);
//     } catch (err) {
//       Alert.alert('Error', 'Failed to fetch data.');
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchData();
//   }, [selectedType]);

//   const handleDelete = async (id: number) => {
//     Alert.alert(
//       'Confirm Delete',
//       'Are you sure you want to delete this item?',
//       [
//         { text: 'Cancel' },
//         {
//           text: 'Delete', style: 'destructive', onPress: async () => {
//             try {
//               await axios.delete(`${API_BASE}/${selectedType}/${id}`);
//               fetchData();
//             } catch {
//               Alert.alert('Error', 'Failed to delete.');
//             }
//           }
//         }
//       ]
//     );
//   };

//   const openModal = (item = null) => {
//     setEditingItem(item);
//     setForm(item || {});
//     setModalVisible(true);
//   };

//   const handleSave = async () => {
//     try {
//       if (editingItem) {
//         await axios.put(`${API_BASE}/${selectedType}/${editingItem.id}`, form);
//       } else {
//         await axios.post(`${API_BASE}/${selectedType}`, form);
//       }
//       setModalVisible(false);
//       setEditingItem(null);
//       setForm({});
//       fetchData();
//     } catch (err) {
//       Alert.alert('Error', 'Failed to save data.');
//     }
//   };

//   const renderItem = ({ item }) => (
//     <View style={{
//       backgroundColor: '#1E1E2E',
//       marginVertical: 6,
//       padding: 12,
//       borderRadius: 10,
//     }}>
//       <Text style={{ color: '#CDD6F4', fontWeight: 'bold' }}>{item.name || item.model}</Text>
//       <View style={{ flexDirection: 'row', marginTop: 8 }}>
//         <TouchableOpacity onPress={() => openModal(item)} style={{ marginRight: 16 }}>
//           <Ionicons name="create-outline" size={20} color="#A6E3A1" />
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => handleDelete(item.id)}>
//           <Ionicons name="trash-outline" size={20} color="#F38BA8" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <ScrollView style={{ flex: 1, backgroundColor: '#11111B', padding: 20 }}>
//       <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#CBA6F7', marginBottom: 20 }}>
//         🛠️ Admin Panel
//       </Text>

//       {/* Hardware type selector */}
//       <View style={{ flexDirection: 'row', marginBottom: 20, flexWrap: 'wrap' }}>
//         {types.map((type) => (
//           <TouchableOpacity
//             key={type}
//             onPress={() => setSelectedType(type)}
//             style={{
//               backgroundColor: selectedType === type ? '#CBA6F7' : '#313244',
//               padding: 10,
//               marginRight: 10,
//               marginBottom: 10,
//               borderRadius: 10,
//             }}
//           >
//             <Text style={{ color: selectedType === type ? '#1E1E2E' : '#CDD6F4' }}>
//               {type.toUpperCase()}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Add new button */}
//       <TouchableOpacity
//         onPress={() => openModal()}
//         style={{
//           backgroundColor: '#89B4FA',
//           padding: 12,
//           borderRadius: 10,
//           marginBottom: 16,
//         }}
//       >
//         <Text style={{ color: '#1E1E2E', fontWeight: 'bold', textAlign: 'center' }}>+ Add New {selectedType.toUpperCase()}</Text>
//       </TouchableOpacity>

//       {/* Hardware list */}
//       {loading ? (
//         <ActivityIndicator color="#CBA6F7" />
//       ) : (
//         <FlatList
//           data={items}
//           renderItem={renderItem}
//           keyExtractor={(item) => item.id.toString()}
//           scrollEnabled={false}
//         />
//       )}

//       {/* Modal for Add/Edit */}
//       <Modal visible={modalVisible} animationType="slide" transparent>
//         <View style={{
//           flex: 1, justifyContent: 'center', alignItems: 'center',
//           backgroundColor: 'rgba(0,0,0,0.6)'
//         }}>
//           <View style={{
//             backgroundColor: '#1E1E2E',
//             width: '90%',
//             padding: 20,
//             borderRadius: 12,
//           }}>
//             <Text style={{ color: '#CBA6F7', fontSize: 18, marginBottom: 10 }}>
//               {editingItem ? 'Edit' : 'Add New'} {selectedType.toUpperCase()}
//             </Text>

//             {/* Dynamic form fields */}
//             {getFormFields(selectedType).map((field) => (
//               <TextInput
//                 key={field}
//                 placeholder={field}
//                 placeholderTextColor="#A6ADC8"
//                 value={form[field]?.toString() || ''}
//                 onChangeText={(text) => setForm({ ...form, [field]: isNaN(Number(text)) ? text : Number(text) })}
//                 style={{
//                   backgroundColor: '#313244',
//                   color: '#CDD6F4',
//                   padding: 10,
//                   borderRadius: 8,
//                   marginBottom: 10,
//                 }}
//               />
//             ))}

//             <TouchableOpacity
//               onPress={handleSave}
//               style={{
//                 backgroundColor: '#A6E3A1',
//                 padding: 12,
//                 borderRadius: 10,
//                 marginBottom: 10,
//               }}
//             >
//               <Text style={{ color: '#1E1E2E', fontWeight: 'bold', textAlign: 'center' }}>
//                 {editingItem ? 'Update' : 'Create'}
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity onPress={() => setModalVisible(false)}>
//               <Text style={{ color: '#F38BA8', textAlign: 'center' }}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </ScrollView>
//   );
// };

// // 🔧 Utility: define fields for each hardware type
// const getFormFields = (type: string) => {
//   switch (type) {
//     case 'cpu':
//       return ['name', 'brand', 'model', 'cores', 'threads', 'tdp', 'performance_score'];
//     case 'gpu':
//       return ['name', 'brand', 'vram', 'tdp', 'pcie_version', 'performance_score', 'price'];
//     case 'psu':
//       return ['wattage', 'connector_6_pin', 'connector_8_pin', 'connector_12_pin'];
//     case 'motherboard':
//       return ['name', 'chipset', 'pcie_version'];
//     default:
//       return [];
//   }
// };

// export default AdministrationScreen;
