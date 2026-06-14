import React, { useState } from 'react';
import { Plus, Edit, Trash2, X, Upload, Loader2 } from 'lucide-react';
import axiosInstance from '../../services/axiosInstance';
import { showToast } from '../common/Toast';

const CATEGORIES = ['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports', 'Books'];

export default function ProductManager({ products = [], onRefresh }) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    discount: '0',
    category: CATEGORIES[0],
    stock: '',
    imageUrl: '',
  });
  
  const [uploading, setUploading] = useState(false);

  const openDrawer = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        title: product.title,
        description: product.description,
        price: product.price.toString(),
        discount: product.discount.toString(),
        category: product.category,
        stock: product.stock.toString(),
        imageUrl: product.images[0] || '',
      });
    } else {
      setEditingProduct(null);
      setFormData({
        title: '',
        description: '',
        price: '',
        discount: '0',
        category: CATEGORIES[0],
        stock: '',
        imageUrl: '',
      });
    }
    setIsOpen(true);
  };

  const closeDrawer = () => {
    setIsOpen(false);
    setEditingProduct(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Multer upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileData = new FormData();
    fileData.append('image', file);

    try {
      setUploading(true);
      const res = await axiosInstance.post('/api/upload', fileData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFormData((prev) => ({ ...prev, imageUrl: res.data.url }));
      showToast('Image uploaded successfully');
    } catch (error) {
      showToast(error.response?.data?.message || 'Error uploading file', 'error');
    } finally {
      setUploading(false);
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validations
    if (!formData.title || !formData.description || !formData.price || !formData.stock) {
      showToast('Please fill out all required fields', 'warning');
      return;
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
      discount: parseFloat(formData.discount || '0'),
      category: formData.category,
      stock: parseInt(formData.stock),
      images: [formData.imageUrl].filter(Boolean),
    };

    try {
      if (editingProduct) {
        await axiosInstance.put(`/api/products/${editingProduct._id}`, payload);
        showToast('Product updated successfully');
      } else {
        await axiosInstance.post('/api/products', payload);
        showToast('Product added successfully');
      }
      closeDrawer();
      onRefresh();
    } catch (error) {
      showToast(error.response?.data?.message || 'Error saving product', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product? This action is permanent.')) {
      return;
    }
    try {
      await axiosInstance.delete(`/api/products/${id}`);
      showToast('Product deleted successfully');
      onRefresh();
    } catch (error) {
      showToast(error.response?.data?.message || 'Error deleting product', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Heading & Add Button */}
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h3 className="text-base font-bold font-heading text-text-primary">Catalog Manager</h3>
          <p className="text-xs text-text-secondary">View, edit, delete, and add products to your inventory</p>
        </div>
        
        <button
          onClick={() => openDrawer()}
          className="flex items-center gap-2 px-4 py-2 bg-accent-blue hover:bg-accent-bright text-white font-medium text-xs rounded-lg transition-all hover:shadow-glow btn-press font-heading"
        >
          <Plus size={15} />
          Add New Product
        </button>
      </div>

      {/* Product Table List */}
      <div className="card-glass border border-borderBlue rounded-xl overflow-hidden shadow-lg">
        {products.length === 0 ? (
          <div className="p-6 text-center text-text-secondary text-sm">
            No products listed in your inventory yet. Click "Add New Product" to start selling.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-background-primary border-b border-borderBlue/40 text-xs font-accent font-semibold text-text-secondary uppercase tracking-wider">
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Discount</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderBlue/20 text-sm">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-surface/30 odd:bg-surface/10 transition-colors">
                    {/* Image */}
                    <td className="px-6 py-3">
                      <img
                        src={p.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'}
                        alt={p.title}
                        className="h-10 w-10 rounded border border-borderBlue object-cover"
                      />
                    </td>
                    {/* Title */}
                    <td className="px-6 py-3 font-semibold text-text-primary">
                      {p.title}
                    </td>
                    {/* Category */}
                    <td className="px-6 py-3 text-text-secondary font-accent text-xs">
                      {p.category}
                    </td>
                    {/* Price */}
                    <td className="px-6 py-3 font-accent font-semibold text-text-primary">
                      ₹{p.price.toFixed(2)}
                    </td>
                    {/* Discount */}
                    <td className="px-6 py-3 font-accent text-accent-electric">
                      {p.discount}%
                    </td>
                    {/* Stock */}
                    <td className="px-6 py-3 font-accent">
                      <span className={p.stock === 0 ? 'text-error font-semibold' : 'text-text-primary'}>
                        {p.stock}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="px-6 py-3 text-right">
                      <div className="flex justify-end gap-3 text-text-secondary">
                        <button
                          onClick={() => openDrawer(p)}
                          className="hover:text-accent-electric transition-colors p-1"
                          title="Edit Product"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="hover:text-error transition-colors p-1"
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Slide-In Side Drawer Form */}
      {isOpen && (
        <>
          {/* Drawer Backdrop Overlay */}
          <div
            onClick={closeDrawer}
            className="fixed inset-0 bg-black/40 z-45"
          ></div>

          {/* Slide-In content container */}
          <div
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-surface border-l border-borderBlue shadow-2xl flex flex-col"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-borderBlue/50 flex justify-between items-center bg-background-secondary">
              <h3 className="text-lg font-bold font-heading text-text-primary">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={closeDrawer}
                className="text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Form Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Title */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Product Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Mechanical Gaming Keyboard"
                  className="bg-background-primary border border-borderBlue rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-bright focus:shadow-glow transition-all"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Description *
                </label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide details about specs, color, warranty..."
                  className="bg-background-primary border border-borderBlue rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-bright focus:shadow-glow transition-all"
                ></textarea>
              </div>

              {/* Price & Discount */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Base Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="999"
                    className="bg-background-primary border border-borderBlue rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-bright font-accent"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    name="discount"
                    min="0"
                    max="100"
                    value={formData.discount}
                    onChange={handleChange}
                    placeholder="10"
                    className="bg-background-primary border border-borderBlue rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-bright font-accent"
                  />
                </div>
              </div>

              {/* Category & Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="bg-background-primary border border-borderBlue rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-bright cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="25"
                    className="bg-background-primary border border-borderBlue rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-bright font-accent"
                  />
                </div>
              </div>

              {/* Upload Image Section */}
              <div className="flex flex-col gap-1 border-t border-borderBlue/30 pt-4">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Product Photo
                </label>
                <div className="flex gap-3 items-center">
                  <label className="flex items-center gap-2 px-3 py-2 bg-surface hover:bg-borderBlue/20 border border-borderBlue rounded-lg text-xs font-medium cursor-pointer text-text-secondary hover:text-text-primary transition-all">
                    {uploading ? (
                      <Loader2 size={14} className="animate-spin text-accent-electric" />
                    ) : (
                      <Upload size={14} className="text-accent-electric" />
                    )}
                    {uploading ? 'Uploading...' : 'Upload Image'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                  <span className="text-[10px] text-text-secondary">or paste URL below</span>
                </div>
                
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="bg-background-primary border border-borderBlue rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-accent-bright transition-all"
                />
                {formData.imageUrl && (
                  <div className="mt-2 h-24 w-24 rounded border border-borderBlue overflow-hidden">
                    <img src={formData.imageUrl} alt="preview" className="h-full w-full object-cover" />
                  </div>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={uploading}
                className="w-full py-2.5 bg-accent-blue hover:bg-accent-bright text-white font-medium rounded-lg text-sm transition-all hover:shadow-glow btn-press mt-6"
              >
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
