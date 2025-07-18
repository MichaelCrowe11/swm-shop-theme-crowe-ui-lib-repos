using System.Collections.Generic;

namespace MyMauiApp.Models
{
    public class AppModel
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public List<string> Features { get; set; }

        public AppModel()
        {
            Features = new List<string>();
        }
    }
}