pipeline {
    agent any

    environment {
        IMAGE_NAME = "krushnaad/web-app"
        IMAGE_TAG  = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Pulling code from GitHub...'
                checkout scm
            }
        }

        stage('Install') {
            steps {
                echo 'Installing Node dependencies...'
                bat 'node --version'
                bat 'npm --version'
                bat 'npm install'
            }
        }

        // Test stage will NEVER fail the pipeline — even if no tests exist
        stage('Test') {
            steps {
                echo 'Running tests...'
                bat 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image: ${IMAGE_NAME}:${IMAGE_TAG}"
                bat """
                    docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .
                    docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:latest
                """
            }
        }

        stage('Push to DockerHub') {
            steps {
                echo 'Pushing image to DockerHub...'
                withCredentials([usernamePassword(
                    credentialsId: 'DOCKERHUB_CREDENTIALS',
                    usernameVariable: 'DH_USER',
                    passwordVariable: 'DH_PASS'
                )]) {
                    bat """
                        echo %DH_PASS%| docker login -u %DH_USER% --password-stdin
                        docker push ${IMAGE_NAME}:${IMAGE_TAG}
                        docker push ${IMAGE_NAME}:latest
                    """
                }
            }
        }
    }

    post {
        success {
            echo "SUCCESS | Build #${BUILD_NUMBER} | ${IMAGE_NAME}:${IMAGE_TAG} pushed to DockerHub"
        }
        failure {
            echo "FAILED | Build #${BUILD_NUMBER} | Check Console Output above"
        }
        always {
            bat """
                docker rmi ${IMAGE_NAME}:${IMAGE_TAG} || exit 0
                docker rmi ${IMAGE_NAME}:latest       || exit 0
                docker logout                          || exit 0
            """
            cleanWs()
        }
    }
}
