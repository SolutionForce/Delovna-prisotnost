import React, { useEffect } from "react";
import { onSnapshot, collection } from "firebase/firestore";
import { useAtom } from "jotai";
import { usersDBAtom } from "../../../atoms/UsersDBAtom";
import { User } from "../../../modules/interfaces/user";
import { firestore } from "../../../services/api/firebaseConfig";

export default function UsersInicialization(): JSX.Element {
	const [, setUsers] = useAtom(usersDBAtom);

	useEffect(() => {
    {
      const unsubscribe = onSnapshot(collection(firestore, "users"), (snapshot) => { //onSnapshot(kolekcija, result, error) avtomatsko poda podatke vsakic ko se v bazi spremenijo
        const data: User[] = snapshot.docs.map((doc): User => {
          return {
            uid: doc.data().uid,
            name: doc.data().name,
            surname: doc.data().surname,
            attendance: doc.data().attendance,
            email: doc.data().email, 
            createdAt: doc.data().createdAt, 
            organizationId: doc.data().organizationId, 
            role: doc.data().role, 
            hourlyRate: doc.data().hourlyRate
          }
        });
        setUsers(data);
      }, (error) => {
        console.warn(error)
      });

      return () => {unsubscribe()}; //To nujno more bit drugace bodo klici v neskoncnost pri onSnapshot()!
    }
  }, [setUsers]);


  return (
		<></>
  );
}
