// =============================================================
// init-db.js — Script d'initialisation de la base MongoDB
// Usage : mongosh mongodb://localhost:27017 init-db.js
// =============================================================

const DB_NAME = 'db_sn_etml';

// =============================================================
// 1. SUPPRESSION DES COLLECTIONS EXISTANTES
// =============================================================

print(`Suppression des collections existantes dans la base "${DB_NAME}"...`);
db.users.drop();
db.posts.drop();
db.comments.drop();

// =============================================================
// 2. CRÉATION DES COLLECTIONS AVEC VALIDATION
// =============================================================

print('Création des collections avec validation...');

db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["username", "email", "password", "isActive", "role", "createdAt"],
      properties: {
        username: { bsonType: "string", description: "Nom d'utilisateur" },
        email:    { bsonType: "string", description: "Email de l'utilisateur" },
        password: { bsonType: "string", description: "Mot de passe hashé" },
        avatar:   { bsonType: "string", description: "URL de l'avatar" },
        bio:      { bsonType: "string", description: "Biographie" },
        followers:  { bsonType: "array", items: { bsonType: "objectId" } },
        following:  { bsonType: "array", items: { bsonType: "objectId" } },
        isActive: { bsonType: "bool" },
        role:     { bsonType: "string", enum: ["user", "admin"] },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

db.createCollection("posts", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "content", "userId", "createdAt"],
      properties: {
        title:     { bsonType: "string" },
        content:   { bsonType: "string" },
        image:     { bsonType: "string", description: "URL de l'image" },
        likes:     { bsonType: "array", items: { bsonType: "objectId" } },
        userId:    { bsonType: "objectId" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
      }
    }
  }
});

db.createCollection("comments", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["content", "postId", "userId", "createdAt"],
      properties: {
        content:   { bsonType: "string" },
        likes:     { bsonType: "array", items: { bsonType: "objectId" } },
        postId:    { bsonType: "objectId" },
        userId:    { bsonType: "objectId" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
      }
    }
  }
});

// =============================================================
// 3. INDEX
// =============================================================
print('Création des index...');

// Users
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ followers: 1 });
db.users.createIndex({ following: 1 });

// Posts
db.posts.createIndex({ userId: 1 });
db.posts.createIndex({ likes: 1 });
db.posts.createIndex({ createdAt: -1 });
db.posts.createIndex({ title: "text", content: "text" }); // recherche full-text (US17)

// Comments
db.comments.createIndex({ postId: 1 });
db.comments.createIndex({ userId: 1 });
db.comments.createIndex({ likes: 1 });

// =============================================================
// 4. DONNÉES DE SEED
// =============================================================
print('Insertion de données de seed...');

// --- Users ---
const now = new Date();

const userId1 = new ObjectId();
const userId2 = new ObjectId();
const userId3 = new ObjectId();

db.users.insertMany([
  {
    _id: userId1,
    username: "alice",
    email: "alice@example.com",
    password: "$2b$10$exampleHashedPasswordAlice",
    avatar: "",
    bio: "Développeuse passionnée de JavaScript",
    followers: [userId2],
    following: [userId2, userId3],
    isActive: true,
    role: "admin",
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: userId2,
    username: "bob",
    email: "bob@example.com",
    password: "$2b$10$exampleHashedPasswordBob",
    avatar: "",
    bio: "Fan de café et de code",
    followers: [userId1, userId3],
    following: [userId1],
    isActive: true,
    role: "user",
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: userId3,
    username: "charlie",
    email: "charlie@example.com",
    password: "$2b$10$exampleHashedPasswordCharlie",
    avatar: "",
    bio: "",
    followers: [userId1],
    following: [userId2],
    isActive: true,
    role: "user",
    createdAt: now,
    updatedAt: now,
  }
]);

// --- Posts ---
const postId1 = new ObjectId();
const postId2 = new ObjectId();
const postId3 = new ObjectId();

db.posts.insertMany([
  {
    _id: postId1,
    title: "Mon premier post",
    content: "Bienvenue sur ce réseau social minimaliste !",
    image: "",
    likes: [userId2, userId3],
    userId: userId1,
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: postId2,
    title: "Tips Express.js",
    content: "Pensez à utiliser des middlewares pour valider vos inputs.",
    image: "",
    likes: [userId1],
    userId: userId2,
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: postId3,
    title: "MongoDB c'est cool",
    content: "Les index multikey sont vraiment pratiques pour les tableaux.",
    image: "",
    likes: [],
    userId: userId3,
    createdAt: now,
    updatedAt: now,
  }
]);

// --- Comments ---
db.comments.insertMany([
  {
    _id: new ObjectId(),
    content: "Super post, merci !",
    likes: [userId1],
    postId: postId1,
    userId: userId2,
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: new ObjectId(),
    content: "Totalement d'accord avec toi.",
    likes: [],
    postId: postId1,
    userId: userId3,
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: new ObjectId(),
    content: "Bon conseil pour Express !",
    likes: [userId3],
    postId: postId2,
    userId: userId1,
    createdAt: now,
    updatedAt: now,
  }
]);

// =============================================================
// 5. RÉSUMÉ
// =============================================================
print("Base de données initialisée avec succès !");
print(`   - Users    : ${db.users.countDocuments()}`);
print(`   - Posts    : ${db.posts.countDocuments()}`);
print(`   - Comments : ${db.comments.countDocuments()}`);
