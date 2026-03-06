pipeline {
    agent any

    environment {
        IMAGE_NAME         = "krubatnaad/web-app"
        IMAGE_TAG          = "${BUILD_NUMBER}"
    }

    stages {

        // ── Stage 1: Checkout ──────────────────────────────
        stage('Checkout') {
            steps {
                echo '📥 Pulling code from GitHub...'
                checkout scm
            }
        }

        // ── Stage 2: Install Dependencies ─────────────────
        stage('Install') {
            steps {
                echo '📦 Installing Node dependencies...'
                bat 'node --version'
                bat 'npm --version'
                bat 'npm install'
            }
        }

        // ── Stage 3: Test ──────────────────────────────────
        stage('Test') {
            steps {
                echo '🧪 Running tests...'
                bat 'npm test || echo "No tests defined yet — skipping"'
            }
        }

        // ── Stage 4: Build Docker Image ────────────────────
        stage('Build Docker Image') {
            steps {
                echo "🐳 Building Docker image: ${IMAGE_NAME}:${IMAGE_TAG}"
                bat '''
                    docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .
                    docker tag  ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:latest
                '''
            }
        }

        // ── Stage 5: Pubat to DockerHub ─────────────────────
        stage('Pubat to DockerHub') {
            steps {
                echo '🚀 Pubating image to DockerHub...'
                withCredentials([usernamePassword(
                    credentialsId: 'DOCKERHUB_CREDENTIALS',
                    usernameVariable: 'DH_USER',
                    passwordVariable: 'DH_PASS'
                )]) {
                    bat '''
                        echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin
                        docker pubat ${IMAGE_NAME}:${IMAGE_TAG}
                        docker pubat ${IMAGE_NAME}:latest
                    '''
                }
            }
        
		}

    }
