 RentHelp | Full-Stack Rental MarketplaceRentHelp is a robust property rental platform that connects Tenants, Landlords, and Admins. It provides a seamless experience for listing properties, managing rentals, and facilitating tenant-landlord communication.🚀 FeaturesFor TenantsProperty Discovery: Browse available properties with real-time filtering by location and price range.Expression of Interest: Send interest notifications to landlords for specific listings with a single click.Detailed View: Access comprehensive property details including descriptions and rent costs.For LandlordsProperty Management: Full CRUD (Create, Read, Update, Delete) capabilities for property listings.Tenant Tracking: View a list of all tenants who have expressed interest in your properties.Occupancy Control: Mark properties as "Occupied" to temporarily hide them from the public search.For AdminsUser Moderation: View all registered users and block/unblock accounts to ensure platform safety.Content Control: Delete any property listing or user account to maintain quality control.🛠️ Tech StackBackend:Runtime: Node.js & Express.jsDatabase: MongoDB with Mongoose ODMAuth: JSON Web Tokens (JWT) & Bcryptjs for password hashingFrontend:UI: Vanilla HTML5, CSS3 (Glassmorphism design), and JavaScriptState: LocalStorage for session management and RBAC (Role-Based Access Control)📂 Project StructurePlaintext├── backend/
│   ├── config/db.js          # MongoDB connection
│   ├── middleware/           # Auth and Role-based guards
│   ├── models/               # User, Property, Interest Schemas
│   ├── routes/               # API Endpoints
│   └── server.js             # Entry point
├── frontend/
│   ├── css/style.css         # Glassmorphism styling
│   ├── js/                   # Client-side logic
│   ├── login.html            # Authentication
│   └── ...                   # Dashboards and Details pages
⚙️ Setup & Installation1. Backend SetupNavigate to the backend folder.Install dependencies:Bashnpm install
Create a .env file and add your credentials:Code snippetPORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
Start the server:Bashnpm run dev
2. Frontend SetupOpen any client-side JavaScript file (e.g., auth.client.js).Update the API_BASE variable to point to your backend:JavaScriptconst API_BASE = "http://localhost:5000/api";
Launch the application using a local server (e.g., Live Server extension in VS Code).🛡️ API Endpoints SummaryMethodEndpointDescriptionAccessPOST/api/auth/registerCreate a new accountPublicPOST/api/auth/loginLog in and get JWTPublicGET/api/propertiesSearch available propertiesTenantPOST/api/propertiesList a new propertyLandlordPOST/api/interests/:idExpress interestTenantGET/api/admin/usersList all usersAdmin
