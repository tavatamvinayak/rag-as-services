const express = require('express')
require('dotenv').config()
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const cors = require('cors')

const Users = require('./schema/user')
const Rag_keys = require('./schema/rag_keys')
const Modelkeys = require('./schema/models_key')
const dbConnect = require('./db');
const rag_keys = require('./schema/rag_keys');

dbConnect();

const app = express()
const port = 8085

//  /// middleware 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());



app.post("/user", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const { userId, firstName, lastName, emailAddress } = req.body; // Get userId from Clerk's JWT token

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: No userId found" });
    }

    // Create and save new user in the database
    const newUser = new Users();
    const FindEmail = await Users.findOne({ email: emailAddress })
    console.log(FindEmail)
    if (FindEmail) {
      console.log("email already exist")
      return res.status(200).json({ success: true, message: "Email already exist" });
    }
    try {

      newUser.userFirstName = firstName
      newUser.userLastName = lastName
      newUser.email = emailAddress
      newUser.clerk_userId = userId
      const createUser = await newUser.save();
      console.log("create note success")
      return res.json({ createUser, success: true, message: "Created user Success" }).status(201);

    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, massage: "creating user Error" })
    }

  } catch (error) {
    console.error("Error saving user:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});


// ---------------------------------- RAG keys -----------
app.post('/rag_keys', ClerkExpressRequireAuth(), async (req, res) => {
  const { File_upload_id, Name_rag_application, LLM_model_name, email, userId } = req.body
  try {
    const newRag_keys = new Rag_keys()
    newRag_keys.File_upload_id = File_upload_id
    newRag_keys.Name_rag_application = Name_rag_application
    newRag_keys.LLM_model_name = LLM_model_name
    newRag_keys.email = email
    newRag_keys.clerk_userId = userId
    // ---------------------
    const FindEmail = await Users.findOne({ email: email })
    if (!FindEmail) {
      console.log("email not exist")
      return res.status(404).json({ success: false, message: "email not exist" })
    }
    newRag_keys.userId = FindEmail._id
    const createRag_keys = await newRag_keys.save();
    console.log("create note success")
    console.log(createRag_keys)
    return res.json({ success: true, message: "Created user Success" }).status(201);

  } catch (error) {
    console.error("Error saving rag_keys:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
})

app.delete('/rag_keys', ClerkExpressRequireAuth(), async (req, res) => {
  const { File_upload_id, LLM_model_name, email, userId } = req.body
  try {
    const rag_keys = await Rag_keys.findOneAndDelete({ File_upload_id: File_upload_id, LLM_model_name: LLM_model_name, email: email, userId: userId });
    if (!rag_keys) {
      return res.status(404).json({ success: false, message: "rag_keys not found" });
    }
    return res.json({ success: true, message: "rag_keys deleted successfully" });
  } catch (error) {
    console.error("Error deleting rag_keys:", error);
  }
})

app.post('/rag_keys/total', ClerkExpressRequireAuth(), async (req, res) => {
  const { userId } = req.body
  try {
    const FindClerk_id = await rag_keys.find({ clerk_userId: userId })
    // console.log(FindClerk_id)
    if (FindClerk_id.length > 0) {

      return res.status(200).json({ rag_keys_total: FindClerk_id.length,
         rag_keys: FindClerk_id,success: true, message: "rag_keys not found" });
    } else {
      return res.status(200).json({ rag_keys: 0 , success: true, message: "rag_keys not found" });
    }
  } catch (error) {
    console.error("Error deleting rag_keys:", error);
    return res.status(404).json({ success: false, message: "rag_keys not found" });
  }
})



app.post('/chatbot', async (req, res) => {
  const { api_key , question } = req.body
  try {
    const res = await fetch(`${process.env.BACKEND_URL_FASTAPI}/chat/${api_key}`,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ question: question })
    })

    const resp = await res.json()
    console.log(resp)
    return res.status(200).json({ answer: resp?.answer, success: true, message: "chatbot rag_keys not found" });
  } catch (error) {
    console.error("Error deleting rag_keys:", error);
    return res.status(404).json({ success: false, message: "chatbot rag_keys not found" });
  }
})










// --------------------------------------------------
app.post('/llm_model_keys', ClerkExpressRequireAuth(), async (req, res) => {
  const { OpenAI_key, Gemini_key, Antripic_key, Grok_key, email, userId } = req.body

  try {
    const newModel = new Modelkeys()

    newModel.OpenAI_key = OpenAI_key
    newModel.Antripic_key = Antripic_key
    newModel.Gemini_key = Gemini_key
    newModel.Grok_key = Grok_key
    newModel.email = email
    newModel.clerk_userId = userId

    const FindEmail = await Users.findOne({ email: email })
    if (!FindEmail) {
      console.log("email not exist")
      return res.status(404).json({ success: false, message: "email not exist" })
    }
    newModel.userId = FindEmail._id
    const createModelkeys = await newModel.save();
    console.log("create model keys store success", createModelkeys)
    return res.json({ success: true, message: "Created modelsKeys Success" }).status(201);

  } catch (error) {
    console.error("Error saving user:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
})

app.put('/llm_model_keys/', ClerkExpressRequireAuth(), async (req, res) => {
  const { OpenAI_key, Gemini_key, Antripic_key, Grok_key, email, userId } = req.body

  try {
    const FindEmail = await Users.findOne({ email: email })
    if (!FindEmail) {
      console.log("email not exist")
      return res.status(404).json({ success: false, message: "email not exist" })
    }
    const FindId = await Modelkeys.findOne({ userId: userId })
    const newNotes = {
      OpenAI_key: OpenAI_key,
      Antripic_key: Antripic_key,
      Gemini_key: Gemini_key,
      Grok_key: Grok_key,
    }
    console.log(FindId?._id, "find id LLM model keys")
    const id = FindId?._id
    const update_llm_model_keys = await Modelkeys.findByIdAndUpdate(id, newNotes, { new: true })
    console.log("update note success")
    return res.json({ update_llm_model_keys, success: true }).status(200);

  } catch (error) {
    console.error("Error saving user:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });

  }

})











app.get('/', (req, res) => {
  res.send('server is up and running...')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

console.log('backend nodejs code running...')