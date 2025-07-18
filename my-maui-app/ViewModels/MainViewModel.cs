using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Windows.Input;

namespace MyMauiApp.ViewModels
{
    public class MainViewModel : INotifyPropertyChanged
    {
        private string _title;
        private string _message;

        public string Title
        {
            get => _title;
            set
            {
                _title = value;
                OnPropertyChanged();
            }
        }

        public string Message
        {
            get => _message;
            set
            {
                _message = value;
                OnPropertyChanged();
            }
        }

        public ICommand LoadDataCommand { get; }

        public MainViewModel()
        {
            Title = "Welcome to Crowe Logic™";
            Message = "Your intelligent interface for mycology.";
            LoadDataCommand = new Command(LoadData);
        }

        private void LoadData()
        {
            // Logic to load data goes here
        }

        public event PropertyChangedEventHandler PropertyChanged;

        protected virtual void OnPropertyChanged([CallerMemberName] string propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}