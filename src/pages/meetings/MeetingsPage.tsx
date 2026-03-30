import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import {useState} from "react";
import {ArabicCalendar} from "@/components/ui/arabic-calendar.tsx";
import {useTranslation} from "react-i18next";
import {MeetingsList} from "@/pages/meetings/components/MeetingsList.tsx";

export const MeetingsPage = () => {
    const {i18n} = useTranslation()
    const [date, setDate] = useState<Date | undefined>(
        new Date(new Date().getFullYear(), 1, 3)
    )
    const SelectedCalendar = i18n.language === "ar" ? ArabicCalendar : Calendar
    const bookedDates = Array.from(
        { length: 15 },
        (_, i) => new Date(new Date().getFullYear(), 1, 12 + i)
    )

    return (
        <div className="flex flex-col mt-14 items-center justify-start min-h-screen text-black dark:bg-green-900">
            <div className="py-10 w-full">
                <Card className="mx-auto w-fit" size={'sm'}>
                    <CardContent className="p-0">
                        <SelectedCalendar
                            mode="single"
                            defaultMonth={date}
                            selected={date}
                            onSelect={setDate}
                            disabled={bookedDates}
                            modifiers={{
                                booked: bookedDates,
                            }}
                            modifiersClassNames={{
                                booked: "[&>button]:line-through opacity-100",
                            }}
                        />
                    </CardContent>
                </Card>
            </div>

            <div className="px-5 py-3 w-full">
                <MeetingsList />
            </div>
        </div>
    )
}