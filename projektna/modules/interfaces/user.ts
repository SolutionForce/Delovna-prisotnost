import { Timestamp } from "@firebase/firestore";

export interface Break {
    start: Timestamp;
    end: Timestamp|null;
    description: string;
}

export interface Attendance {
    timeIn: Timestamp;
    timeOut: Timestamp|null;
    breaks: Break[];
}

export interface User {
    uid: string;
    name: string;
    surname: string;
    attendance: Attendance[];
}
