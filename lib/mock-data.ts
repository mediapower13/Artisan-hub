// Mock data for development - replace with real database calls later
import type { User, Artisan, Skill, Category, Review, Enrollment } from "./types"

export const mockCategories: Category[] = [
  {
    id: "1",
    name: "Fashion & Tailoring",
    description: "Learn clothing design, tailoring, and fashion creation",
    icon: "👗",
    skillCount: 12,
  },
  {
    id: "2",
    name: "Technology & Repairs",
    description: "Phone repairs, computer maintenance, and tech skills",
    icon: "📱",
    skillCount: 8,
  },
  {
    id: "3",
    name: "Beauty & Wellness",
    description: "Hair styling, makeup, skincare, and wellness services",
    icon: "💄",
    skillCount: 15,
  },
  {
    id: "4",
    name: "Food & Catering",
    description: "Cooking, baking, catering, and food business",
    icon: "🍳",
    skillCount: 10,
  },
  {
    id: "5",
    name: "Arts & Crafts",
    description: "Painting, sculpture, crafts, and creative arts",
    icon: "🎨",
    skillCount: 7,
  },
  {
    id: "6",
    name: "Construction & Trades",
    description: "Carpentry, plumbing, electrical work, and building trades",
    icon: "🔨",
    skillCount: 9,
  },
]

export const mockArtisans: Artisan[] = [
  {
    id: "1",
    email: "fatima.adebayo@example.com",
    password: "hashed_password",
    firstName: "Fatima",
    lastName: "Adebayo",
    phone: "+234 803 123 4567",
    role: "artisan",
    businessName: "Fatima's Fashion House",
    specialization: ["Fashion Design", "Tailoring", "Embroidery"],
    experience: 8,
    location: "Ilorin, Kwara State",
    rating: 4.8,
    totalReviews: 127,
    verified: true,
    profileImage: "/professional-woman-tailor.png",
    portfolio: [
      {
        id: "1",
        title: "Traditional Agbada Collection",
        description: "Custom-made traditional Agbada for special occasions",
        images: ["/traditional-agbada.png"],
        completedAt: new Date("2024-01-15"),
      },
    ],
    skills: [],
    createdAt: new Date("2023-06-01"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "2",
    email: "ibrahim.tech@example.com",
    password: "hashed_password",
    firstName: "Ibrahim",
    lastName: "Suleiman",
    phone: "+234 807 987 6543",
    role: "artisan",
    businessName: "TechFix Solutions",
    specialization: ["Phone Repair", "Computer Maintenance", "Software Installation"],
    experience: 5,
    location: "Ilorin, Kwara State",
    rating: 4.6,
    totalReviews: 89,
    verified: true,
    profileImage: "/young-man-technician.png",
    portfolio: [],
    skills: [],
    createdAt: new Date("2023-08-15"),
    updatedAt: new Date("2024-01-18"),
  },
]

export const mockSkills: Skill[] = [
  {
    id: "1",
    artisanId: "1",
    title: "Complete Fashion Design Masterclass",
    description: "Learn fashion design from basics to advanced techniques. Create your own clothing line.",
    category: "Fashion & Tailoring",
    difficulty: "intermediate",
    duration: "8 weeks",
    price: 25000,
    maxStudents: 15,
    currentStudents: 8,
    images: ["/fashion-design-class.png"],
    syllabus: [
      "Introduction to Fashion Design",
      "Pattern Making Basics",
      "Fabric Selection and Care",
      "Sewing Techniques",
      "Design Development",
      "Portfolio Creation",
    ],
    requirements: ["Basic sewing knowledge helpful but not required", "Notebook and pen", "Measuring tape"],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    artisanId: "2",
    title: "Smartphone Repair Fundamentals",
    description: "Master the art of smartphone repair and start your own repair business.",
    category: "Technology & Repairs",
    difficulty: "beginner",
    duration: "4 weeks",
    price: 15000,
    maxStudents: 10,
    currentStudents: 6,
    images: ["/placeholder-pzimb.png"],
    syllabus: [
      "Phone Components Overview",
      "Common Issues and Diagnosis",
      "Screen Replacement",
      "Battery Replacement",
      "Software Troubleshooting",
      "Business Setup Tips",
    ],
    requirements: ["No prior experience needed", "Basic tools will be provided during class"],
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-20"),
  },
]

// Mock database functions
export const mockDatabase = {
  users: [...mockArtisans] as User[],
  skills: mockSkills,
  categories: mockCategories,
  enrollments: [] as Enrollment[],
  reviews: [] as Review[],

  // User operations
  async createUser(user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    const newUser: User = {
      ...user,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.users.push(newUser)
    return newUser
  },

  async getUserByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null
  },

  async getUserById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) || null
  },

  // Skill operations
  async getSkills(): Promise<Skill[]> {
    return this.skills
  },

  async getSkillsByCategory(category: string): Promise<Skill[]> {
    return this.skills.filter((skill) => skill.category === category)
  },

  async getSkillById(id: string): Promise<Skill | null> {
    return this.skills.find((skill) => skill.id === id) || null
  },

  // Category operations
  async getCategories(): Promise<Category[]> {
    return this.categories
  },

  // Artisan operations
  async getArtisans(): Promise<Artisan[]> {
    return this.users.filter((user) => user.role === "artisan") as Artisan[]
  },

  async getArtisanById(id: string): Promise<Artisan | null> {
    const user = this.users.find((user) => user.id === id && user.role === "artisan")
    return (user as Artisan) || null
  },
}
