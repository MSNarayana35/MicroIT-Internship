CREATE DATABASE IF NOT EXISTS eportfolio;

USE eportfolio;

CREATE TABLE IF NOT EXISTS resume_files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    filepath VARCHAR(255) NOT NULL,
    file_size INT,
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    description TEXT
);

CREATE TABLE IF NOT EXISTS download_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    file_id INT,
    ip_address VARCHAR(45),
    download_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (file_id) REFERENCES resume_files(id)
);

INSERT INTO resume_files (filename, filepath, file_size, description)
VALUES ('resume.pdf', 'files/resume.pdf', 25126, 'Melluri Shiva Narayana CV');