import './App.css'

// import Webcam from './Webcam'
import { useEffect } from 'react'
import MusicVideo from './MusicVideo'
import Editor from './Editor'
// import firestore from './Firestore'
// import { doc, setDoc } from 'firebase/firestore'
import { getStorage, ref, uploadBytes, deleteObject, listAll } from "firebase/storage"


function App() {

  // Firebase test
  // useEffect(() => {
  //   const mike = doc(firestore, 'users/mike')
  //   const mikeData = {
  //     name: 'mike',
  //     time: new Date(),
  //   }
  //   setDoc(mike, mikeData).then(() => {
  //     console.log('set mike!')
  //   })
  // }, [])

  // useEffect(() => {

  //   const storage = getStorage()
  //   const storageRef = ref(storage, 'frames')

  //   const bytes = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x2c, 0x20, 0x77, 0x6f, 0x72, 0x6c, 0x64, 0x21]);
  //   uploadBytes(storageRef, bytes).then((snapshot) => {
  //     console.log('Uploaded an array!');
  //   });
  // }, [])

  // useEffect(() => {
  //   const storage = getStorage()
  //   const storageRef = ref(storage, 'frames')
  //   listAll(storageRef).then((results) => {
  //     results.items.forEach((i) => {
  //       deleteObject(i)
  //     })
  //   })
  // }, [])

  return (
    <>
      {/* <MusicVideo/> */}
      {/* <Webcam /> */}
      <Editor></Editor>
    </>
  );
}

export default App
