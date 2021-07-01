import { useEffect, useState } from "react";

import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

type DeviceType = {
  id: string;
  city: string | undefined;
  name: string;
  roomHint: string | undefined;
  traits: Record<string, {
    output: string;
  }>
  type: string;
}

export function useDevices(city: string, user_id:string) {
  const [devices, setDevices] = useState<DeviceType[]>([])
  const [title, setTitle] = useState('');

//   console.log(user_id)
  useEffect(() => {
    const deviceRef = database.ref(`users/xKYUPWAUIFNh3YzvmkJmLp2VbgC2/devices/`);

    deviceRef.on('value', device => {
        // console.log(device)
    //   const databaseRoom = room.val();
    //   const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

    //   const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
    //     return {
    //       id: key,
    //       content: value.content,
    //       author: value.author,
    //       isHighlighted: value.isHighlighted,
    //       isAnswered: value.isAnswered,
    //       likeCount: Object.values(value.likes ?? {}).length,
    //       likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],
    //     }
    //   })

    //   setTitle(databaseRoom.title);
    //   setQuestions(parsedQuestions);
    })

    return () => {
      deviceRef.off('value');
    }
  }, [city, user_id]);

  return { devices, title }
}