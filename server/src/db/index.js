const sqlite = require("sqlite3").verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'chat.db');

const db = new sqlite.Database(dbPath);

db.run("CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, message TEXT, timestamp DATETIME)");
db.get("SELECT COUNT(*) as count FROM messages", (err, row) => {
    if (err) throw err;
    if (row.count === 0) {
        // const messages = [
        //     { name: "Elon Musk", message: "Just spent 5 hours playing Cyberpunk 2077. The future of gaming is definitely electric!", timestamp: new Date('2023-01-01T12:00:00') },
        //     { name: "Trump", message: "Nobody plays video games better than me, believe me. I have the highest scores, they're tremendous scores!", timestamp: new Date('2023-01-01T12:05:00') },
        //     { name: "Elon Musk", message: "Have you tried Factorio? It's basically a simulation of what we're doing at Tesla, but with more aliens.", timestamp: new Date('2023-01-01T12:10:00') },
        //     { name: "Trump", message: "I'm building a wall... in Minecraft. It's going to be huge, and it's going to be beautiful!", timestamp: new Date('2023-01-01T12:15:00') },
        //     { name: "Elon Musk", message: "Just beat Elden Ring. The AI in these games is getting impressive. Not as impressive as our Tesla AI though.", timestamp: new Date('2023-01-01T12:20:00') },
        //     { name: "Trump", message: "These game developers, they come to me and say 'Sir, how do you get such amazing high scores?' It's natural talent, folks.", timestamp: new Date('2023-01-01T12:25:00') },
        //     { name: "Elon Musk", message: "What if we put Steam on Tesla screens? Gaming while supercharging could be the next big thing.", timestamp: new Date('2023-01-01T12:30:00') },
        //     { name: "Trump", message: "Mario? Great guy. Known him for years. Makes the best games, everybody says so.", timestamp: new Date('2023-01-01T12:35:00') },
        //     { name: "Elon Musk", message: "Just coded a small game during my lunch break. Might turn it into the next Dogecoin.", timestamp: new Date('2023-01-01T12:40:00') },
        //     { name: "Trump", message: "These violent video games... not as violent as CNN's coverage of me, believe me!", timestamp: new Date('2023-01-01T12:45:00') }
        // ];
        const messages = [
            { name: "Buddha", message: "The path to enlightenment begins with understanding that life's suffering comes from attachment. True happiness lies in letting go and finding peace within ourselves.", timestamp: new Date('2023-01-01T12:00:00') },
            { name: "Michael Jackson", message: "Man, that's deep! You know, through my music and dance, I've always tried to bring joy and heal the world. But sometimes I wonder if we're all just dancing to life's rhythm without understanding the beat.", timestamp: new Date('2023-01-01T12:05:00') },
            { name: "Buddha", message: "We are shaped by our thoughts; we become what we think.", timestamp: new Date('2023-01-01T12:10:00') },
            { name: "Michael Jackson", message: "In a world filled with hate, we must still dare to hope.", timestamp: new Date('2023-01-01T12:15:00') },
            { name: "Buddha", message: "Peace comes from within. Do not seek it without.", timestamp: new Date('2023-01-01T12:20:00') },
            { name: "Michael Jackson", message: "If you want to make the world a better place, take a look at yourself and make a change.", timestamp: new Date('2023-01-01T12:25:00') },
            { name: "Buddha", message: "Three things cannot be long hidden: the sun, the moon, and the truth.", timestamp: new Date('2023-01-01T12:30:00') },
            { name: "Michael Jackson", message: "All I want to say is that they don't really care about us.", timestamp: new Date('2023-01-01T12:35:00') },
            { name: "Buddha", message: "Holding on to anger is like grasping a hot coal with the intent of throwing it at someone else; you are the one who gets burned.", timestamp: new Date('2023-01-01T12:40:00') },
            { name: "Michael Jackson", message: "We've got to heal the world, make it a better place.", timestamp: new Date('2023-01-01T12:45:00') },
            { name: "Buddha", message: "You will not be punished for your anger, you will be punished by your anger.", timestamp: new Date('2023-01-01T12:50:00') },
            { name: "Michael Jackson", message: "I'm starting with the man in the mirror.", timestamp: new Date('2023-01-01T12:55:00') },
            { name: "Buddha", message: "The soul is the essence of our being, the eternal light within.", timestamp: new Date('2023-01-01T13:00:00') },
            { name: "Michael Jackson", message: "When you connect with your soul, you can feel the rhythm of humanity.", timestamp: new Date('2023-01-01T13:05:00') },
            { name: "Buddha", message: "Empathy is the gateway to understanding all beings.", timestamp: new Date('2023-01-01T13:10:00') },
            { name: "Michael Jackson", message: "Through music, we can share the language of the soul.", timestamp: new Date('2023-01-01T13:15:00') },
            { name: "Buddha", message: "To understand others is to cultivate wisdom.", timestamp: new Date('2023-01-01T13:20:00') },
            { name: "Michael Jackson", message: "Every child's smile contains the universe's wisdom.", timestamp: new Date('2023-01-01T13:25:00') },
            { name: "Buddha", message: "Compassion is the bridge between souls.", timestamp: new Date('2023-01-01T13:30:00') },
            { name: "Michael Jackson", message: "When we dance, our souls speak without words.", timestamp: new Date('2023-01-01T13:35:00') },
            { name: "Buddha", message: "In silence, we hear the whispers of all souls.", timestamp: new Date('2023-01-01T13:40:00') },
            { name: "Michael Jackson", message: "Love is the key that unlocks every heart.", timestamp: new Date('2023-01-01T13:45:00') },
            { name: "Buddha", message: "Each act of kindness ripples through eternity.", timestamp: new Date('2023-01-01T13:50:00') },
            { name: "Michael Jackson", message: "Music can heal what words cannot touch.", timestamp: new Date('2023-01-01T13:55:00') },
            { name: "Buddha", message: "To be understood, first seek to understand.", timestamp: new Date('2023-01-01T14:00:00') },
            { name: "Michael Jackson", message: "Your soul's light can illuminate the darkest paths.", timestamp: new Date('2023-01-01T14:05:00') },
            { name: "Buddha", message: "Mindfulness opens the door to universal empathy.", timestamp: new Date('2023-01-01T14:10:00') },
            { name: "Michael Jackson", message: "Together, we can create harmony in diversity.", timestamp: new Date('2023-01-01T14:15:00') },
            { name: "Buddha", message: "True peace comes from understanding interconnectedness.", timestamp: new Date('2023-01-01T14:20:00') },
            { name: "Michael Jackson", message: "Every soul carries a song waiting to be heard.", timestamp: new Date('2023-01-01T14:25:00') },
            { name: "Buddha", message: "Empathy is the heart's wisdom in action.", timestamp: new Date('2023-01-01T14:30:00') },
            { name: "Michael Jackson", message: "Let your light shine bright enough to guide others.", timestamp: new Date('2023-01-01T14:35:00') }
        ];
        const stmt = db.prepare("INSERT INTO messages (name, message, timestamp) VALUES (?, ?, ?)");
        messages.forEach(msg => {
            stmt.run(msg.name, msg.message, msg.timestamp);
        });
        stmt.finalize();
    }
});

module.exports = db;