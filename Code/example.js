// Example JavaScript File
// This is a sample code file to demonstrate the file management dashboard

class FileManager {
  constructor() {
    this.files = [];
  }

  addFile(filename, content) {
    this.files.push({
      name: filename,
      content: content,
      created: new Date(),
      modified: new Date()
    });
    console.log(`Added file: ${filename}`);
  }

  getFile(filename) {
    return this.files.find(file => file.name === filename);
  }

  updateFile(filename, newContent) {
    const file = this.getFile(filename);
    if (file) {
      file.content = newContent;
      file.modified = new Date();
      console.log(`Updated file: ${filename}`);
      return true;
    }
    return false;
  }

  deleteFile(filename) {
    const index = this.files.findIndex(file => file.name === filename);
    if (index !== -1) {
      this.files.splice(index, 1);
      console.log(`Deleted file: ${filename}`);
      return true;
    }
    return false;
  }

  listFiles() {
    return this.files.map(file => ({
      name: file.name,
      size: file.content.length,
      modified: file.modified
    }));
  }
}

// Usage example
const manager = new FileManager();
manager.addFile('example.txt', 'Hello World!');
console.log(manager.listFiles());
