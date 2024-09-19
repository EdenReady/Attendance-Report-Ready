import io
import os
import logging
from flask import Flask, send_file, request, send_from_directory
from flask_cors import CORS
from Settings.consts import LOCAL_REPORT
from Utilities.get_data import call_function

log_dir = os.path.dirname(os.path.abspath(__file__))
log_file = os.path.join(log_dir, 'server.log')

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(log_file),
        logging.StreamHandler()
    ]
)

react_build_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "react-build")

app = Flask(__name__, static_folder=react_build_path)
application = app

cors = CORS(app, origins='*', methods=['GET', 'HEAD', 'POST', 'OPTIONS', 'PUT'],
            supports_credentials=False, max_age=None, send_wildcard=True,
            always_send=True, automatic_options=False)

@app.route('/')
def serve_react_app():
    logging.info('Serving React App')
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/static/<path:path>')
def serve_static_files(path):
    logging.info(f'Serving static file: {path}')
    return send_from_directory(os.path.join(app.static_folder, 'static'), path)

@app.route("/download_report_file", methods=['POST'])
def download_report_file():
    try:
        emp_file = request.files['empFile']
        rep_file = request.files['repFile']
        month = request.form.get('month')
        year = request.form.get('year')

        # שמירת הקבצים בתיקיית LOCAL_REPORT בשרת
        emp_file_path = os.path.join(LOCAL_REPORT, emp_file.filename)
        rep_file_path = os.path.join(LOCAL_REPORT, rep_file.filename)
        emp_file.save(emp_file_path)
        rep_file.save(rep_file_path)

        logging.info(f'Files received: {emp_file.filename}, {rep_file.filename}')
        logging.info(f'Month: {month}, Year: {year}')

        # עיבוד הדוחות
        df = call_function(emp_file_path, rep_file_path, date=f'{year}-{month}')

        # שמירת הדוח בתיקיית LOCAL_REPORT בשרת
        save_server_path = os.path.join(LOCAL_REPORT, f'report-{month}-{year}.csv')
        df.to_csv(save_server_path, index=False, encoding='utf-8-sig')

        logging.info(f'Report saved to: {save_server_path}')

        # שליחת הדוח להורדה למשתמש
        return send_file(save_server_path, mimetype='text/csv', as_attachment=True, download_name=f'report-{month}-{year}.csv')

    except Exception as e:
        logging.error(f'Error in download_report_file: {str(e)}')
        return f"An error occurred: {str(e)}", 500

if __name__ == '__main__':
    app.run(use_reloader=False, debug=False)
