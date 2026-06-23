import React, { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function App() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // NEW: State to hold our success message
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    quantity: ""
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  // NEW: Helper function to show a message, then clear it after 3 seconds
  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) throw new Error("Failed to fetch products from backend.");
      const data = await response.json();
      setProducts(data);
      setError("");
    } catch (err) {
      setError("Failed to fetch products. Check if your FastAPI server is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage(""); // Clear any old success messages

    try {
      const url = isEditing
        ? `${API_BASE_URL}/products/${formData.id}`
        : `${API_BASE_URL}/products`;

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Could not process product storage request.");

      // Parse the response to get the message from FastAPI
      const data = await response.json();

      setFormData({ id: "", name: "", description: "", price: "", quantity: "" });

      // NEW: Trigger the success banner
      showSuccess(isEditing ? "Product updated successfully!" : "Product added successfully!");

      setIsEditing(false);
      fetchProducts();
    } catch (err) {
      setError(`Failed to ${isEditing ? 'update' : 'add'} product details.`);
    }
  };

  const handleEdit = (product) => {
    setFormData(product);
    setIsEditing(true);
    setError("");
    setSuccessMessage("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this product?")) return;

    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete product.");

      // NEW: Trigger the success banner
      showSuccess(`Product ${id} deleted successfully!`);

      fetchProducts();
    } catch (err) {
      setError("Failed to delete product from inventory.");
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toString().includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">

        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="bg-white px-5 py-2 rounded-full font-bold shadow-lg text-indigo-700 tracking-wide">
            Total Items: {products.length}
          </div>
          <input
            type="text"
            placeholder="Search / Find by ID, name, or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-1/2 md:w-1/3 px-4 py-2.5 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400 border-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-gray-700">
              {isEditing ? '📝 Modify Target Product' : '➕ Register New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <input required type="text" name="id" value={formData.id} onChange={handleInputChange} disabled={isEditing} placeholder="Product ID" className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:bg-gray-100 transition-all text-sm" />
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Name" className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all text-sm" />
                <input required type="text" name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all text-sm" />
                <input required type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="Price (₹)" className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all text-sm" />
                <input required type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} placeholder="Quantity" className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all text-sm" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-xl transition-colors shadow-md">
                  {isEditing ? 'Update Configuration' : 'Add to Catalog'}
                </button>
                {isEditing && (
                  <button type="button" onClick={() => { setIsEditing(false); setFormData({ id: "", name: "", description: "", price: "", quantity: "" }); }} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-xl transition-colors">
                    Discard Changes
                  </button>
                )}
              </div>
            </form>

            {/* ERROR BANNER */}
            {error && (
              <div className="mt-4 bg-red-500 text-white px-4 py-3 rounded-xl shadow-md font-medium text-sm transition-all animate-pulse">
                ⚠️ {error}
              </div>
            )}

            {/* NEW: SUCCESS BANNER */}
            {successMessage && (
              <div className="mt-4 bg-green-500 text-white px-4 py-3 rounded-xl shadow-md font-medium text-sm transition-all">
                ✅ {successMessage}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col justify-center items-center text-center border border-gray-100">
            <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">Track. Manage. Grow.</h3>
            <p className="text-gray-400 mb-6 text-sm italic leading-relaxed">Streamline your inventory layout with atomic state monitoring synchronized over local REST modules.</p>
            <div className="border border-dashed border-gray-300 px-5 py-2.5 rounded-xl font-bold text-gray-400 text-xs tracking-widest uppercase">
              POWERED BY <span className="text-orange-500 font-extrabold">ANKUR</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 overflow-x-auto border border-gray-100">
          <h2 className="text-xl font-bold mb-4 text-gray-700">Catalog Registry</h2>
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Identification ID</th>
                <th className="py-3 px-4">Label Name</th>
                <th className="py-3 px-4">Specification Details</th>
                <th className="py-3 px-4">Price Base</th>
                <th className="py-3 px-4">Stock Units</th>
                <th className="py-3 px-4 text-center">Data Controls</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-gray-400 font-medium">Syncing database layers...</td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-gray-400 italic font-medium">No matching entries discovered inside inventory indexes.</td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-50 hover:bg-indigo-50/30 transition-colors group">
                    <td className="py-3.5 px-4 font-bold text-indigo-600">{product.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-gray-800">{product.name}</td>
                    <td className="py-3.5 px-4 text-gray-500 max-w-xs truncate">{product.description}</td>
                    <td className="py-3.5 px-4 text-gray-700 font-medium">
  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.price)}
</td>
                    <td className="py-3.5 px-4 text-gray-600 font-medium">{product.quantity} units</td>
                    <td className="py-3.5 px-4 text-center">
                      <button onClick={() => handleEdit(product)} className="text-indigo-600 hover:text-indigo-800 font-bold mr-4 opacity-80 group-hover:opacity-100 transition-opacity">Edit</button>
                      <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700 font-bold opacity-80 group-hover:opacity-100 transition-opacity">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default App;