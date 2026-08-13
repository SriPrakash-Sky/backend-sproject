import Client from "../models/client.model.js";

export const createClient = async (req, res) => {
  try {
    const data = req.body;

    const payload = {
      name: data.name,
    };
    await Client.create(payload);

    return res.status(201).json({
      success: true,
      data: [],
      message: "Client created successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getClients = async (req, res) => {
  try {
    const result = await Client.find({}).lean();

    return res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateClient = async (req, res) => {
  try {
    let { id, name } = req.body;

    let payload = { name };

    await Client.findByIdAndUpdate(id, payload);

    return res.status(200).json({
      success: true,
      data: [],
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const deleteClient = async (req, res) => {
  try {
    let { id } = req.body;

    await Client.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      data: [],
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// PORT=5000
// # MONGO_URI=mongodb+srv://SriPrakashA:NlXRkNJwozO6g1eT@cluster0.p6lpodd.mongodb.net/quiz-app
// MONGO_URI=mongodb://localhost:27017/sproject
// JWT_SECRET=12345SPRO
// MODE=dev
// BASE_URL=http://localhost:5173
// # SWAGGER_HOST=quiz.skyraantech.com/backend
// # SWAGGER_SCHEME=https
