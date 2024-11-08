import cv2
import sys

def process_image(input_path, output_path):
    image = cv2.imread(input_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.resize(gray, (1000, int(1000 * image.shape[0] / image.shape[1])))  # Resize
    gray = cv2.GaussianBlur(gray, (5, 5), 0)  # Blur to reduce noise
    gray = cv2.adaptiveThreshold(
        gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
    )  # Adaptive thresholding

    cv2.imwrite(output_path, gray)

if __name__ == "__main__":
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    process_image(input_path, output_path)
