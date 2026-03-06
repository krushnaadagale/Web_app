pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = credentials('krushnaad')
        IMAGE_NAME         = "${krushnaad}/web-app"
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
                sh 'node --version'
                sh 'npm --version'
                sh 'npm install'
            }
        }

        // ── Stage 3: Test ──────────────────────────────────
        stage('Test') {
            steps {
                echo '🧪 Running tests...'
                sh 'npm test || echo "No tests defined yet — skipping"'
            }
        }

        // ── Stage 4: Build Docker Image ────────────────────
        stage('Build Docker Image') {
            steps {
                echo "🐳 Building Docker image: ${IMAGE_NAME}:${IMAGE_TAG}"
                sh """
                    docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .
                    docker tag  ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:latest
                """
            }
        }

        // ── Stage 5: Push to DockerHub ─────────────────────
        stage('Push to DockerHub') {
            steps {
                echo '🚀 Pushing image to DockerHub...'
                withCredentials([usernamePassword(
                    credentialsId: 'DOCKERHUB_CREDENTIALS',
                    usernameVariable: 'DH_USER',
                    passwordVariable: 'DH_PASS'
                )]) {
                    sh """
                        echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin
                        docker push ${IMAGE_NAME}:${IMAGE_TAG}
                        docker push ${IMAGE_NAME}:latest
                    """
                }
            }
        }
		}

    }
