import api from "./api";

const blogService = {
    getAllBlogs: async (category = "all", search = "") => {
        const params = {};
        if (category !== "all") params.category = category;
        if (search) params.search = search;

        const response = await api.get("/blogs", { params });
        return response.data;
    },

    getBlogById: async (id) => {
        const response = await api.get(`/blogs/${id}`);
        return response.data;
    },

    createBlog: async (blogData) => {
        const response = await api.post("/blogs", blogData);
        return response.data;
    },

    updateBlog: async (id, blogData) => {
        const response = await api.put(`/blogs/${id}`, blogData);
        return response.data;
    },

    deleteBlog: async (id) => {
        const response = await api.delete(`/blogs/${id}`);
        return response.data;
    },
};

export default blogService;
