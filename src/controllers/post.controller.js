// src/controllers/post.controller.js
const { StatusCodes } = require('http-status-codes');
const catchAsync = require('../utils/catchAsync');
const postService = require('../services/post.service');
const pick = require('../utils/pick');

const createPost = catchAsync(async (req, res) => {
  const post = await postService.createPost(req.body, req.user.id);
  res.status(StatusCodes.CREATED).send({ success: true, message: 'Tạo bài viết thành công, đang chờ duyệt.', data: post });
});

const getPosts = catchAsync(async (req, res) => {
  const queryOptions = pick(req.query, ['page', 'limit', 'status', 'authorId']);
  const result = await postService.queryPosts(queryOptions);
  res.status(StatusCodes.OK).send({ success: true, data: result });

});

const getPublicPosts = catchAsync(async (req, res) => {
  const queryOptions = pick(req.query, ['page', 'limit', 'category']);
  const posts = await postService.getApprovedPosts(queryOptions);
  res.status(StatusCodes.OK).send({ success: true, data: posts });
});

const getPostById = catchAsync(async (req, res) => {
  const post = await postService.getPostById(req.params.id);
  res.status(StatusCodes.OK).send({ success: true, data: post });
});

const updatePost = catchAsync(async (req, res) => {
  const post = await postService.updatePostById(req.params.id, req.body, req.user);
  res.status(StatusCodes.OK).send({ success: true, message: 'Cập nhật bài viết thành công.', data: post });
});

const reviewPost = catchAsync(async (req, res) => {
  const post = await postService.reviewPostById(req.params.id, req.body);
  res.status(StatusCodes.OK).send({ success: true, message: 'Duyệt bài viết thành công.', data: post });
});

const deletePost = catchAsync(async (req, res) => {
  await postService.deletePostById(req.params.id, req.user);
  res.status(StatusCodes.NO_CONTENT).send();
});

const uploadPostImage = catchAsync(async (req, res) => {
  // if (!req.file) {
  //     throw new ApiError(StatusCodes.BAD_REQUEST, 'Vui lòng chọn một file để upload.');
  // }
  // const imageUrl = `/uploads/posts/${req.file.filename}`;
  // res.status(StatusCodes.OK).send({ success: true, message: 'Upload ảnh thành công', data: { imageUrl } });
        try {
            // Nếu không có file
            if(!req.file) {
                throw new ApiError(StatusCodes.BAD_REQUEST, 'Vui lòng chọn một file để upload.');
            }

            // ⚠️ log raw error
            if (!req.file.path) {
            console.error("Cloudinary upload failed. Full file object:", req.file);
            throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Upload lên Cloudinary thất bại.");
            }

            const imageUrl = req.file.path; // link ảnh Cloudinary
            const folder = req.body.type || 'funi' // folder đã lưu
            // Sau khi upload thành công, multer-storage-cloudinary sẽ trả về link tại req.file.path
            res.status(StatusCodes.OK).send({
                success: true,
                message: 'Upload ảnh thành công',
                data: {
                    imageUrl,
                    folder
                }
            })
        } catch (error) {
            console.error("Upload error:", error); // log cụ thể lỗi
            throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Đã có lỗi xảy ra ' + error.message);
        }
});

const publishPost = catchAsync(async (req, res) => {
  const { publish } = req.body; 
  const post = await postService.publishPostById(req.params.id, publish);
  const message = publish ? 'Đăng tải bài viết thành công.' : 'Hủy đăng tải bài viết thành công.';
  res.status(StatusCodes.OK).send({ success: true, message, data: post });
});

const getPublicPostsLandingPage = catchAsync(async (req, res) => {
  // Đảm bảo nó gọi đúng hàm service
  const posts = await postService.getPublishedPosts(); 
  res.status(StatusCodes.OK).send({ success: true, data: posts });
});

const getTotalPosts = catchAsync(async (req, res) => {
  const queryOptions = pick(req.query, ['authorId']);
  const data = await postService.getTotalPosts(queryOptions);
  res.status(StatusCodes.OK).send({ success: true, message: 'Lấy bản ghi thành công', data: data})
})

module.exports = {
  createPost,
  getPosts,
  getPublicPosts,
  getPostById,
  updatePost,
  reviewPost,
  deletePost,
  uploadPostImage,
  publishPost,
  getPublicPostsLandingPage,
  getTotalPosts
};