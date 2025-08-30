"use client"
import { useAuth, useUser, } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { BACKEND_URL_NODEJS } from "@/constant/clints";
import { BACKEND_URL_FASTAPI } from "@/constant/clints";
import Chatbot from "@/components/dashboard/Chatbot";
import { Token } from "@clerk/nextjs/server";

export default function Main() {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const { getToken } = useAuth();
    const { user }: any = useUser()

    const [isModalOpen2, setIsModalOpen2] = React.useState(false);
    const openModal2 = () => setIsModalOpen2(true);
    const closeModal2 = () => setIsModalOpen2(false);

    // ----------------------------------------- total rag api -----------------------------------------
    const [totalRagApi, setTotalRagApi] = useState(0);
    const [RAG_Data, setRAG_Data] = useState([])
    const [totalSpendTokens, setTotalSpendTokens] = useState(0);
    const [totalRequestsForApi, setTotalRequestsForApi] = useState(0);

    const totalcheck = async () => {
        const token = await getToken();
        try {
            const res = await fetch(`${BACKEND_URL_NODEJS}/rag_keys/total`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ userId: user.id, })
            })
            const data = await res.json();
            setTotalRagApi(data.rag_keys_total);
            setRAG_Data(data.rag_keys)

        } catch (error) {
            console.log(error)
        }
        // ----------------------------------------- total spend tokens api -----------------------------------------


        try {

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        totalcheck()
    }, [])

    const deleteRAG = async (id: any) => {
        const token = await getToken();
        try {

        }
        catch (error) {
            console.log(error)
        }
    }

    // test chat 
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        {
            text: 'Hello! How can I assist you today?',
            isBot: true,
            timestamp: new Date(),
        },
    ]);
    const [api_token, setApi_token] = useState('')
    const api_set = (api_token: any) => {
        setApi_token(api_token)
    }
    const chat = async () => {
        console.log('chat fetch function')

        const userMessage = {
            text: input,
            isBot: false,
            timestamp: new Date(),
        };
        setMessages((prev: any) => [...prev, userMessage]);

        try {
            const res = await fetch(`${BACKEND_URL_FASTAPI}/chat/${api_token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    question: input
                })
            })

            const resp = await res.json()
            console.log(resp)
            if (resp.answer) {
                setMessages((prev) => [...prev, { text: resp.answer, isBot: true, timestamp: new Date() }])
                setInput('');
            }
        } catch (error) {
            console.log(error)
            setInput('');
        }

    }


    return (
        <>
            <div>

                {/* <!-- Main Content --> */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* header for create a RAG API */}
                    <header className="bg-white shadow p-4 flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Welcome, RAG as Services</h2>
                        <div className="flex items-center space-x-4">
                            <button onClick={openModal} className="border  cursor-pointer hover:bg-black hover:text-white px-4 py-2 rounded-lg ">Create a RAG Application</button>
                        </div>
                    </header>
                    {/* <!-- Dashboard Content --> */}
                    <main className="flex-1 overflow-y-auto p-6">
                        {/* <!-- Stats Cards --> */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-lg font-semibold">{`Total RAG API's`}</h3>
                                <p className="text-3xl font-bold text-blue-600">{totalRagApi || '0'}</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-lg font-semibold">Total Spend Tokens</h3>
                                <p className="text-3xl font-bold text-green-600">{totalSpendTokens || '0'}</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-lg font-semibold">{`Total Requests For API's`}</h3>
                                <p className="text-3xl font-bold text-purple-600">{totalRequestsForApi || '0'}</p>
                            </div>
                        </div>

                        {/* <!-- Table --> */}
                        <Table RAG_Data={RAG_Data} deleteRAG={deleteRAG} openModal2={openModal2} api_set={api_set} />

                        {/* examples */}
                        <Examples_for_api />
                        {/* modal form */}
                        <Modal isOpen={isModalOpen} onClose={closeModal} getToken={getToken} user={user} totalcheck={totalcheck} />
                        {
                            isModalOpen2 && (
                                <>
                                    <Chatbot chat={chat} messages={messages} setMessages={setMessages} input={input} setInput={setInput} onClose={closeModal2} />
                                </>
                            )
                        }
                    </main>

                </div>
            </div>
        </>
    )
}


function Modal({ isOpen, onClose, getToken, user, totalcheck, }: any) {
    if (!isOpen) return null;


    const [loading, setLoading] = useState(false)
    const [name, setName] = useState("")


    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event: any) => {
        setSelectedFile(event.target.files[0]); // For single file upload
    };

    const handleFetch = async function () {
        if (!name.length) {
            alert("Please Enter Name")
            return
        }
        setLoading(true)
        try {
            const token = await getToken();
            console.log(BACKEND_URL_NODEJS, BACKEND_URL_FASTAPI)
            // profile checking 
            const res = await fetch(`${BACKEND_URL_NODEJS}/user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ userId: user.id, firstName: user.firstName, lastName: user?.lastName, emailAddress: user.emailAddresses[0].emailAddress }),
            })
            const data = await res.json()
            console.log(data)
            if (data.success) {
                console.log("user saved")
                // upload pdf is 
                if (!selectedFile) {
                    alert('No file selected or invalid file type.');
                    return;
                }
                // Create FormData object to send the file
                const formData = new FormData();
                formData.append('file', selectedFile);

                try {
                    const response = await fetch(`${BACKEND_URL_FASTAPI}/upload`, {
                        method: 'POST',
                        body: formData,
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        alert(errorData.detail || 'File upload failed');
                        setLoading(false)
                    }
                    else {
                        const data = await response.json()
                        console.log(data?.upload_id)

                        // update the RAG keys api nodejs 
                        const res = await fetch(`${BACKEND_URL_NODEJS}/rag_keys`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({ userId: user.id, Name_rag_application: name, File_upload_id: data?.upload_id, LLM_model_name: "OpenAI", email: user.emailAddresses[0].emailAddress })
                        })
                        const resp = await res.json()
                        console.log(resp)
                        if (resp.success) {
                            console.log("rag keys saved")
                            alert('File uploaded successfully');
                            totalcheck()
                        }
                        setLoading(false)
                        onClose();
                    }
                } catch (error) {
                    console.error('Error uploading file:', error);
                    setLoading(false)
                }

            }

        } catch (error) {
            console.log(error)
            console.log("error user saved")
            setLoading(false)
        }
    }

    return (
        <div
            className="fixed inset-0  backdrop-blur-sm bg-opacity-50 flex items-center justify-center"
            onClick={onClose}
        >
            <div
                className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-semibold mb-4">Create a New Service</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-bold  text-gray-700">
                            Web API Name <span className="text-red-800">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                            placeholder="Enter your application"
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-bold  text-gray-700">
                            Select a PDF file to upload: <span className="text-red-800">*</span>
                        </label>
                        <input type="file" onChange={handleFileChange} style={{
                            border: 1, borderColor: "blue", borderStyle: "dashed", padding: 10, cursor: "pointer", color: "blue"
                        }}
                            accept="application/pdf"
                        />
                    </div>
                    <div >
                        <label htmlFor="name" className="block text-sm font-bold  text-gray-700">
                            {`this application 5 request only for testing`}
                        </label>
                    </div>

                    <div className="flex justify-end space-x-2">
                        {
                            loading ? (<>
                                <button className="border  cursor-pointer hover:bg-black hover:text-white px-4 py-2 rounded-lg ">
                                    Loading...
                                </button></>) : (
                                <>
                                    <button onClick={handleFetch} className="border  cursor-pointer hover:bg-black hover:text-white px-4 py-2 rounded-lg ">
                                        Create A RAG API
                                    </button>
                                </>
                            )
                        }

                    </div>

                </div>
            </div>
        </div>
    );
}

function Table({ RAG_Data, deleteRAG, openModal2, api_set }: any) {

    return (<>
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b">
                        <th className="py-2">API Name</th>
                        <th className="py-2">Token</th>
                        <th className="py-2">Chat</th>
                        <th className="py-2">Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        RAG_Data.map((e: any, index: any) => {
                            return (
                                <tr key={index} className="border-b hover:bg-gray-50">
                                    <td className="py-2">{e.Name_rag_application}</td>
                                    <td className="py-2">{e.File_upload_id}</td>
                                    <td className="py-2">
                                        <button className="bg-gray-200 cursor-pointer hover:bg-green-700 hover:text-white font-bold py-2 px-4 rounded" onClick={() => {
                                            api_set(`${e.File_upload_id}`)
                                            openModal2()
                                        }}>Chat test</button>
                                    </td>

                                    <td className="py-2"><button className="bg-red-500 cursor-pointer hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => deleteRAG(e.id)}>Delete</button></td>
                                </tr>
                            )
                        })
                    }

                </tbody>
            </table>
        </div>
    </>)
}

function Examples_for_api() {
    return (
        <>
            <div className="fetch pt-20 m">
                <h1 className="font-bold text-2xl mb-4">Examples for API</h1>
                <div>

                    <p>{process.env.NEXT_PUBLIC_BACKEND_URL_FASTAPI}/chat/{`{Token}`}</p>
                    <p> body :{`{"question": "string"}`}
                    </p>
                </div>
                <div>
                    <p>Response :-{` {"answer": answer}`}</p>
                </div>
            </div>
        </>
    )
}