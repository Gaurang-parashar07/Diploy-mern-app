import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
	const navigate = useNavigate()
	const [currentUser, setCurrentUser] = useState(null)
	const [posts, setPosts] = useState([
		{
			id: 1,
			user: 'Jane Doe',
			avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
			content: 'Just launched my new project built with React and Tailwind CSS! The developer experience has been absolutely incredible. 🚀✨',
			time: '2 hours ago',
			likes: 12,
			hasLiked: false,
			comments: [
				{ user: 'Alex', text: 'This looks clean!' },
				{ user: 'Sam', text: 'Agreed, design is top notch.' }
			]
		},
		{
			id: 2,
			user: 'John Smith',
			avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
			content: 'Enjoying a quiet morning coffee while reviewing some code pull requests. Nothing beats a productive start to the day. ☕️💻',
			time: '4 hours ago',
			likes: 24,
			hasLiked: false,
			comments: []
		}
	])
	const [newPostText, setNewPostText] = useState('')
	const [commentInputs, setCommentInputs] = useState({})
	const [products, setProducts] = useState([])
	const [fetchError, setFetchError] = useState(null)

	const handleError = (err) => {
		console.error(err)
		setFetchError(err?.message || 'Failed to load products')
	}

	const fetchProducts = async () => {
		try {
			const url = 'http://localhost:8080/products'
			const token = localStorage.getItem('jwtToken')
			if (!token) {
				handleError(new Error('Missing auth token'))
				return
			}

			const response = await fetch(url, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			})

			if (!response.ok) {
				throw new Error(`Products request failed with status ${response.status}`)
			}

			const result = await response.json()
			console.log('Products loaded:', result)
			setProducts(result)
		} catch (err) {
			handleError(err)
		}
	}

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem('currentUser'))
		if (!user) {
			navigate('/')
		} else {
			setCurrentUser(user)
			fetchProducts()
		}
	}, [navigate])

	const handleLogout = () => {
		localStorage.removeItem('currentUser')
		localStorage.removeItem('jwtToken')
		localStorage.removeItem('loggedInUser')
		navigate('/login')
	}

	const handleCreatePost = (e) => {
		e.preventDefault()
		if (!newPostText.trim()) return

		const newPost = {
			id: Date.now(),
			user: currentUser?.name || currentUser?.email.split('@')[0] || 'You',
			avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', // placeholder avatar
			content: newPostText,
			time: 'Just now',
			likes: 0,
			hasLiked: false,
			comments: []
		}

		setPosts([newPost, ...posts])
		setNewPostText('')
	}

	const handleLike = (id) => {
		setPosts(
			posts.map((post) => {
				if (post.id === id) {
					return {
						...post,
						likes: post.hasLiked ? post.likes - 1 : post.likes + 1,
						hasLiked: !post.hasLiked,
						triggerPop: !post.hasLiked // helper state to trigger pop animation
					}
				}
				return post
			})
		)
	}

	const handleAddComment = (postId) => {
		const text = commentInputs[postId] || ''
		if (!text.trim()) return

		setPosts(
			posts.map((post) => {
				if (post.id === postId) {
					return {
						...post,
						comments: [
							...post.comments,
							{ user: currentUser?.name || 'You', text: text.trim() }
						]
					}
				}
				return post
			})
		)
		setCommentInputs({ ...commentInputs, [postId]: '' })
	}

	if (!currentUser) return null

	return (
		<div className="min-h-screen bg-insta-bg pb-12">
			{/* Top Navbar with backdrop filter blur */}
			<nav className="sticky top-0 glass-navbar z-50 px-6 py-4 shadow-sm">
				<div className="max-w-5xl mx-auto flex items-center justify-between">
					<h1 
						className="text-2xl font-black italic bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 cursor-pointer tracking-wider" 
						onClick={() => navigate('/dashboard')}
					>
						Prev
					</h1>

					{/* Search Bar */}
					<div className="hidden sm:block">
						<input
							type="text"
							placeholder="Search posts..."
							className="px-4 py-2 text-xs rounded-xl focus:outline-none w-64 input-insta"
						/>
					</div>

					{/* Navigation Menu */}
					<div className="flex items-center space-x-6">
						<button onClick={() => navigate('/dashboard')} className="text-xl hover:scale-115 active:scale-95 transition-all duration-200" title="Home">🏠</button>
						<button className="text-xl hover:scale-115 active:scale-95 transition-all duration-200" title="Messages">✉️</button>
						<button className="text-xl hover:scale-115 active:scale-95 transition-all duration-200" title="Explore">🧭</button>
						
						{/* User profile dropdown and Logout */}
						<div className="flex items-center space-x-3 border-l border-white/10 dark:border-white/5 pl-4">
							<span className="text-xs font-bold text-insta-strong hidden md:inline">
								{currentUser.name || currentUser.email.split('@')[0]}
							</span>
							<button 
								onClick={handleLogout}
								className="text-[11px] font-bold tracking-wide uppercase px-4 py-2 rounded-xl text-white bg-white/5 hover:bg-white/10 dark:bg-black/20 dark:hover:bg-black/35 border border-white/10 hover:border-white/20 transition-all duration-200"
							>
								Log Out
							</button>
						</div>
					</div>
				</div>
			</nav>

			{/* Main Layout Container */}
			<div className="max-w-5xl mx-auto flex py-8 px-6 gap-8 items-start">
				{/* Feed Section */}
				<div className="flex-1 max-w-[640px] mx-auto space-y-6 animate-fade-in-up">
					
					{/* Create Post Card */}
					<div className="glass-panel rounded-2xl p-6 shadow-lg">
						<div className="flex items-start space-x-4">
							<img 
								src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" 
								alt="Your Avatar" 
								className="w-10 h-10 rounded-full border border-white/20 object-cover"
							/>
							<form onSubmit={handleCreatePost} className="flex-1">
								<textarea
									value={newPostText}
									onChange={(e) => setNewPostText(e.target.value)}
									placeholder={`What's on your mind, ${currentUser.name || currentUser.email.split('@')[0]}?`}
									className="w-full text-xs rounded-xl outline-none resize-none placeholder:text-insta-muted input-insta p-4 mb-3"
									rows="3"
								/>
								<div className="flex justify-between items-center pt-1">
									{/* Form helpers */}
									<div className="flex space-x-4 text-base">
										<button type="button" className="hover:scale-120 active:scale-95 transition-transform" title="Add Image">🖼️</button>
										<button type="button" className="hover:scale-120 active:scale-95 transition-transform" title="Emoji">😊</button>
										<button type="button" className="hover:scale-120 active:scale-95 transition-transform" title="Add Location">📍</button>
									</div>
									<button
										type="submit"
										disabled={!newPostText.trim()}
										className={`py-2 px-5 rounded-xl text-white font-bold text-xs tracking-wider uppercase shadow-md transition-all duration-300 transform active:scale-95 ${
											newPostText.trim() 
												? 'insta-gradient hover:insta-gradient-hover cursor-pointer hover:shadow-indigo-500/10 hover:scale-[1.02]' 
												: 'bg-white/5 text-insta-muted cursor-not-allowed border border-white/5'
										}`}
									>
										Post
									</button>
								</div>
							</form>
						</div>
					</div>

					{/* Products fetched from backend */}
			{fetchError ? (
				<div className="glass-panel rounded-2xl p-6 shadow-lg text-red-400">
					Failed to load products: {fetchError}
				</div>
			) : products.length > 0 ? (
				<div className="glass-panel rounded-2xl p-6 shadow-lg space-y-4">
					<h2 className="text-sm uppercase tracking-wider text-insta-muted font-bold">Products</h2>
					{products.map((product, index) => (
						<div key={index} className="rounded-2xl bg-white/5 p-4 border border-white/10">
							<p className="text-xs font-bold text-insta-strong">{product.name}</p>
							<p className="text-[11px] text-insta-muted mt-2">{product.description}</p>
							<p className="text-xs font-bold text-insta-blue mt-3">${product.price}</p>
						</div>
					))}
				</div>
			) : (
				<div className="glass-panel rounded-2xl p-6 shadow-lg text-insta-muted">
					Loading products...
				</div>
			)}

			{/* Feed / Posts List */}
					<div className="space-y-6">
						{posts.map((post, idx) => (
							<div 
								key={post.id} 
								className="glass-panel rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-in-up"
								style={{ animationDelay: `${(idx + 1) * 0.1}s` }}
							>
								{/* Post Header */}
								<div className="flex items-center justify-between p-4 border-b border-white/5">
									<div className="flex items-center space-x-3">
										<img 
											src={post.avatar} 
											alt={post.user} 
											className="w-9 h-9 rounded-full border border-white/10 object-cover"
										/>
										<div>
											<p className="text-xs font-bold text-insta-strong">{post.user}</p>
											<p className="text-[10px] text-insta-muted font-medium mt-0.5">{post.time}</p>
										</div>
									</div>
									<button className="text-insta-muted hover:text-insta-strong p-1 rounded-full hover:bg-white/5 transition-colors">
										<svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
									</button>
								</div>

								{/* Post Content */}
								<div className="p-5 text-sm text-insta-strong leading-relaxed break-words whitespace-pre-line">
									{post.content}
								</div>

								{/* Action Buttons */}
								<div className="px-5 py-3.5 border-t border-white/5 flex items-center justify-between bg-white/[0.01]">
									<div className="flex space-x-5">
										<button 
											onClick={() => handleLike(post.id)}
											className={`text-xl transition-all duration-200 focus:outline-none ${
												post.triggerPop ? 'animate-heart-pop' : ''
											} ${post.hasLiked ? 'text-red-500 scale-110' : 'text-insta-muted hover:scale-110'}`}
										>
											{post.hasLiked ? '❤️' : '🤍'}
										</button>
										<button className="text-xl text-insta-muted hover:text-insta-strong hover:scale-110 transition-transform">💬</button>
										<button className="text-xl text-insta-muted hover:text-insta-strong hover:scale-110 transition-transform">📤</button>
									</div>
									<button className="text-xl text-insta-muted hover:text-insta-strong hover:scale-110 transition-transform">🔖</button>
								</div>

								{/* Post Stats */}
								<div className="px-5 pb-3">
									<p className="text-xs font-extrabold text-insta-strong">{post.likes} likes</p>
								</div>

								{/* Comments List */}
								{post.comments.length > 0 && (
									<div className="px-5 pb-4 space-y-2 border-t border-white/5 pt-3 bg-black/5 dark:bg-black/10">
										{post.comments.map((comment, index) => (
											<p key={index} className="text-xs text-insta-muted">
												<span className="font-extrabold text-insta-strong mr-2">{comment.user}</span>
												{comment.text}
											</p>
										))}
									</div>
								)}

								{/* Add Comment Input */}
								<div className="border-t border-white/5 px-5 py-3 flex items-center bg-white/[0.02]">
									<input 
										type="text" 
										placeholder="Add a comment..." 
										value={commentInputs[post.id] || ''}
										onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
										onKeyDown={(e) => {
											if (e.key === 'Enter') handleAddComment(post.id)
										}}
										className="flex-1 text-xs outline-none py-1.5 px-3 rounded-lg input-insta"
									/>
									<button 
										onClick={() => handleAddComment(post.id)}
										disabled={!(commentInputs[post.id] || '').trim()}
										className="text-xs text-insta-blue font-bold ml-3 hover:text-indigo-400 disabled:opacity-30 disabled:hover:text-insta-blue transition-colors"
									>
										Post
									</button>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Sidebar (Desktop only) */}
				<div className="hidden lg:block w-[300px] space-y-6 sticky top-[92px]">
					{/* Mini Profile */}
					<div className="flex items-center space-x-4 p-2">
						<img 
							src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" 
							alt="Your Avatar" 
							className="w-12 h-12 rounded-full border border-white/20 object-cover shadow-sm"
						/>
						<div>
							<p className="text-sm font-bold text-insta-strong">
								{currentUser.name || currentUser.email.split('@')[0]}
							</p>
							<p className="text-xs text-insta-muted font-medium mt-0.5">{currentUser.email}</p>
						</div>
					</div>

					{/* Suggestions section */}
					<div className="glass-panel rounded-2xl p-5 shadow-md">
						<div className="flex justify-between items-center mb-4">
							<span className="text-xs font-extrabold uppercase tracking-wider text-insta-muted">Suggestions for you</span>
							<button className="text-[10px] font-bold text-insta-blue hover:underline">See All</button>
						</div>
						
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-3">
									<img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100" className="w-8 h-8 rounded-full object-cover border border-white/10" alt="" />
									<div>
										<p className="text-xs font-bold text-insta-strong">Michael_Brown</p>
										<p className="text-[9px] text-insta-muted font-medium mt-0.5">Followed by Alex + 3 more</p>
									</div>
								</div>
								<button className="text-xs text-insta-blue font-bold hover:underline">Follow</button>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-3">
									<img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" className="w-8 h-8 rounded-full object-cover border border-white/10" alt="" />
									<div>
										<p className="text-xs font-bold text-insta-strong">David_Miller</p>
										<p className="text-[9px] text-insta-muted font-medium mt-0.5">New to AppLogo</p>
									</div>
								</div>
								<button className="text-xs text-insta-blue font-bold hover:underline">Follow</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Dashboard

