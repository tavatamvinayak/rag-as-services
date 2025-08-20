"use client"
import Header from "@/components/dashboard/Header";
import { useAuth , useUser} from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Main from "@/components/dashboard/Main"

export default function Dashboard({ }: any) {
    const { isSignedIn } = useAuth();
    const [userLogin, SetUserLogin] = useState<any>(false)

    useEffect(() => {
        console.log(isSignedIn)
        if (isSignedIn) {
            console.log("signed in")
            SetUserLogin(true)
        }
    }, [isSignedIn])

    return (
        <>
            <div>
                {
                    userLogin && (<>
                        <div>
                            <Header />
                            <section className="p-12 border ">
                                <div className="py-12">
                                    <Main />
                                </div>
                            </section>
                        </div>
                    </>)
                }



            </div>
        </>
    )
}