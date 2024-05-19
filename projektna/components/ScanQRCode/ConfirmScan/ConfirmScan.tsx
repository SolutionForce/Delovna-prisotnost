import { useAtom } from "jotai";
import React, { useState } from "react";
import {
  Button,
  H2,
  H3,
  Separator,
  Text,
  TextArea,
  XStack,
  YStack,
} from "tamagui";
import { usersDBAtom } from "../../../Atoms/UsersDBAtom";
import { Attendance, Break, User } from "../../../modules/interfaces/user";
import { Timestamp } from "@firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "../../../services/api/firebaseConfig";
import { StyleSheet, View } from "react-native";
import Colors from "../../Colors/Colors";
import { useNavigation } from "@react-navigation/native";

interface ConfirmScanProps {
  scannedData: string;
}

const hardcodedAllowedUser = "ebRi8pmxCgQzxRuJyPCx";
const hardcodedAllowedScannedData =
  "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
const buttonDisabledOpacitiy = 0.4;

export default function ConfirmScan(props: ConfirmScanProps) {
  const [users] = useAtom(usersDBAtom);
  const [breakDescription, setbreakDescription] = useState<string>("");
  const [breakDescriptionEmptyError, setbreakDescriptionEmptyError] =
    useState<boolean>(false);
  const [savedSuccessfullyText, setSavedSuccessfullyText] =
    useState<string>("");
  const currentUser: User | undefined = users.find(
    (user) => user.uid === hardcodedAllowedUser
  ); //! hardcoded
  const timeNow: Timestamp = Timestamp.now();
  const navigator = useNavigation();

  if (!currentUser)
    return (
      <XStack justifyContent="center">
        <H3 color="red">Current user unknown</H3>
      </XStack>
    );

  const savedSuccessfully = (message: string) => {
    setbreakDescriptionEmptyError(false);
    setbreakDescription("");
    setSavedSuccessfullyText(message);
    navigator.navigate("Home" as never);
  };

  const saveStartedWork = async () => {
    const currentUserDoc = doc(firestore, "users", currentUser.uid);
    const newAttendance: Attendance = {
      timeIn: timeNow,
      timeOut: null,
      breaks: [],
    };
    try {
      await setDoc(
        currentUserDoc,
        { attendance: [...currentUser.attendance, newAttendance] },
        { merge: true }
      );
      savedSuccessfully("Successfully saved 'Started work'");
    } catch (error) {
      console.warn("Could not save 'Started work'");
    }
  };

  const saveEndedWork = async () => {
    const currentUserDoc = doc(firestore, "users", currentUser.uid);
    const updatedAttendances = [...currentUser.attendance];

    try {
      updatedAttendances[updatedAttendances.length - 1].timeOut = timeNow;
      await setDoc(
        currentUserDoc,
        { attendance: updatedAttendances },
        { merge: true }
      );
      savedSuccessfully("Successfully saved 'Ended work'");
    } catch (error) {
      console.warn("Could not save 'Ended work'");
    }
  };

  const saveStartedABreak = async () => {
    if (breakDescription === "") {
      setbreakDescriptionEmptyError(true);
      setSavedSuccessfullyText("");
      return;
    }

    setbreakDescriptionEmptyError(false);

    const currentUserDoc = doc(firestore, "users", currentUser.uid);
    const updatedAttendances = [...currentUser.attendance];

    const newBreak: Break = {
      start: timeNow,
      end: null,
      description: breakDescription,
    };

    try {
      updatedAttendances[updatedAttendances.length - 1].breaks.push(newBreak);
      await setDoc(
        currentUserDoc,
        { attendance: updatedAttendances },
        { merge: true }
      );
      savedSuccessfully("Successfully saved 'Started a break'");
    } catch (error) {
      console.warn("Could not save 'Started a break'");
    }
  };

  const saveEndedABreak = async () => {
    const currentUserDoc = doc(firestore, "users", currentUser.uid);
    const updatedAttendances = [...currentUser.attendance];

    try {
      updatedAttendances[updatedAttendances.length - 1].breaks[
        updatedAttendances[updatedAttendances.length - 1].breaks.length - 1
      ].end = timeNow;
      updatedAttendances[updatedAttendances.length - 1].breaks[
        updatedAttendances[updatedAttendances.length - 1].breaks.length - 1
      ].description += breakDescription !== "" ? " / " + breakDescription : "";
      await setDoc(
        currentUserDoc,
        { attendance: updatedAttendances },
        { merge: true }
      );
      savedSuccessfully("Successfully saved 'Ended a break'");
    } catch (error) {
      console.warn("Could not save 'Ended a break'");
    }
  };

  const isStartWorkAllowed = (): boolean => {
    if (currentUser.attendance.length === 0) return true;

    if (currentUser.attendance[currentUser.attendance.length - 1].timeOut)
      return true;

    return false;
  };

  const isEndWorkAllowed = (): boolean => {
    if (currentUser.attendance.length === 0) return false;

    if (!currentUser.attendance[currentUser.attendance.length - 1].timeOut) {
      const breaks =
        currentUser.attendance[currentUser.attendance.length - 1].breaks;
      if (breaks.length === 0) return true;

      if (breaks[breaks.length - 1].end) return true;
    }

    return false;
  };

  const isStartABreakAllowed = (): boolean => {
    if (currentUser.attendance.length === 0) return false;

    if (!currentUser.attendance[currentUser.attendance.length - 1].timeOut) {
      const breaks =
        currentUser.attendance[currentUser.attendance.length - 1].breaks;
      if (breaks.length === 0) return true;

      if (breaks[breaks.length - 1].end) return true;
    }

    return false;
  };

  const isEndABreakAllowed = (): boolean => {
    if (currentUser.attendance.length === 0) return false;

    if (!currentUser.attendance[currentUser.attendance.length - 1].timeOut) {
      const breaks =
        currentUser.attendance[currentUser.attendance.length - 1].breaks;
      if (breaks.length === 0) return false;

      if (!breaks[breaks.length - 1].end) return true;
    }

    return false;
  };

  if (props.scannedData !== hardcodedAllowedScannedData)
    return (
      <XStack justifyContent="center">
        <H3 color="red">Scanned QR code not valid</H3>
      </XStack>
    );

  const disableStartWork = !isStartWorkAllowed();
  const disableEndWork = !isEndWorkAllowed();
  const disableStartBreak = !isStartABreakAllowed();
  const disableEndBreak = !isEndABreakAllowed();
  const date = timeNow.toDate().toLocaleString("sl-SI").split(",");
  return (
    <YStack>
      <View style={styles.predgovor}>
        <Text style={styles.dobrodosel}>
          Wellcome back to work {currentUser.name} {currentUser.surname}!!{" "}
          {"\n"}Its nice to see you. {"\u{1F970}"}
          {"\n"}
        </Text>

        <Text style={styles.datum}>
          Today is <Text style={styles.boldItalic}>{date[0]}</Text> and you
          logged in at<Text style={styles.boldItalic}>{date[1]}</Text>.{"\n"}
          Have a nice working day.
          {"\u{1F4AA}"}
        </Text>
      </View>

      <XStack marginTop="$8" justifyContent="center">
        <Text fontSize="$7" color="green">
          {savedSuccessfullyText}
        </Text>
      </XStack>

      <Text marginVertical="auto" style={styles.naslov}>
        Work
      </Text>
      <XStack marginTop="$5" space="$3" justifyContent="center">
        <Button
          style={styles.gumb}
          theme="active"
          size="$6"
          onPress={saveStartedWork}
          disabled={disableStartWork}
          opacity={disableStartWork ? buttonDisabledOpacitiy : undefined}
        >
          <Text style={styles.gumbTekts}>Started</Text>
        </Button>
        <Button
          style={styles.gumb}
          theme="active"
          size="$6"
          onPress={saveEndedWork}
          disabled={disableEndWork}
          opacity={disableEndWork ? buttonDisabledOpacitiy : undefined}
        >
          <Text style={styles.gumbTekts}>Ended</Text>
        </Button>
      </XStack>

      <Separator marginVertical="$10" />

      <Text marginVertical="auto" style={styles.naslov}>
        Break
      </Text>
      <XStack space="$3" justifyContent="center" marginBottom="$3">
        <Button
          style={styles.gumb}
          theme="active"
          size="$6"
          onPress={saveStartedABreak}
          disabled={disableStartBreak}
          opacity={disableStartBreak ? buttonDisabledOpacitiy : undefined}
        >
          <Text style={styles.gumbTekts}>Started</Text>
        </Button>
        <Button
          style={styles.gumb}
          theme="active"
          size="$6"
          onPress={saveEndedABreak}
          disabled={disableEndBreak}
          opacity={disableEndBreak ? buttonDisabledOpacitiy : undefined}
        >
          <Text style={styles.gumbTekts}>Ended</Text>
        </Button>
      </XStack>
      {breakDescriptionEmptyError && (
        <XStack justifyContent="center">
          <Text style={styles.description} fontSize="$6" color="red">
            Description for a break is required
          </Text>
        </XStack>
      )}
      <TextArea
        style={styles.breakArea}
        size="$4"
        borderWidth={2}
        placeholder="Enter a description of the break..."
        defaultValue={breakDescription}
        onChangeText={(e) => {
          setbreakDescription(e);
          setbreakDescriptionEmptyError(false);
        }}
      />
    </YStack>
  );
}

const styles = StyleSheet.create({
  gumb: {
    borderRadius: 50,
    backgroundColor: Colors.PURPLE,
  },
  gumbTekts: {
    color: Colors.BLACK,
  },
  naslov: {
    alignContent: "center",
    textAlign: "center",
    //  backgroundColor: Colors.PURPLE,
    width: "100%",
    height: 50,
    fontSize: 30,
    color: Colors.BLACK,
    borderRadius: 20,
    marginBottom: 10,
  },
  dobrodosel: {
    marginLeft: 10,
  },
  datum: {
    marginLeft: 10,
    paddingBottom: 10,
  },
  boldItalic: {
    fontWeight: "bold",
    fontStyle: "italic",
  },
  predgovor: {
    backgroundColor: Colors.PURPLE,
    opacity: 0.8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.BLACK,
    marginTop: 6
  },
  description: {},
  breakArea: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
