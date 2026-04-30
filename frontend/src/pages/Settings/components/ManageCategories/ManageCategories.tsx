import { Plus, RefreshCw, Search } from "lucide-react";

export default function ManageCategories() {
  return (
    <div className="admin-user-tab">
      <div className="admin-user-card">
        <div className="admin-user-toolbar">
          <div className="admin-user-toolbar-left">
            <button
              className="admin-user-tool-btn"
             
            >
              <Plus size={16} />
              Add Categories
            </button>
            <button
              className="admin-user-tool-btn"
             
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
          <div className="admin-user-toolbar-right">
            <div className="admin-user-search">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search by Name"
               
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
