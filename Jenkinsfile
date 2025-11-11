pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds')
        BACKEND_IMAGE = "8951174890/django-backend"
        FRONTEND_IMAGE = "8951174890/react-frontend"
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Cloning repository...'
                checkout scm
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                dir('backend') {
                    script {
                        echo 'Building backend Docker image...'
                        sh "docker build -t ${BACKEND_IMAGE}:latest ."
                    }
                }
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                dir('frontend') {
                    script {
                        echo 'Building frontend Docker image...'
                        sh "docker build -t ${FRONTEND_IMAGE}:latest ."
                    }
                }
            }
        }

        stage('Push Images to DockerHub') {
            steps {
                script {
                    echo 'Logging in and pushing images to DockerHub...'
                    sh "echo ${DOCKERHUB_CREDENTIALS_PSW} | docker login -u ${DOCKERHUB_CREDENTIALS_USR} --password-stdin"
                    sh "docker push ${BACKEND_IMAGE}:latest"
                    sh "docker push ${FRONTEND_IMAGE}:latest"
                }
            }
        }

        stage('Deploy to Minikube') {
            steps {
                script {
                    echo 'Deploying to Minikube...'

                    // Copy kubeconfig from default location if needed
                    sh 'mkdir -p $HOME/.kube && cp /home/devops/.kube/config $HOME/.kube/config || echo "Using existing config"'

                    // Apply K8s manifests
                    sh '''
                       minikube kubectl -- apply -f k8s/backend-deployment.yaml
                       minikube kubectl -- apply -f k8s/backend-service.yaml
                       minikube kubectl -- apply -f k8s/frontend-deployment.yaml
                       minikube kubectl -- apply -f k8s/frontend-service.yaml
                    '''

                    sh 'kubectl get pods -A'
                }
            }
        }
    }

    post {
        success {
            echo '✅ Deployment completed successfully!'
        }
        failure {
            echo '❌ Build failed. Check the logs.'
        }
    }
}
