import { Plus, RefreshCw, Search } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { appLogger } from "../../../../utils/logger";
import { useApiNotifier, useNotifications } from "../../../../components/common";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
interface Supplier {
    supplier_id: number;
    name: string;
    contact_person: string;
    email: string;
    phone: string;
}

export default function ManageSupplier() {

    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(false);
    const { notifyApiSuccess, notifyApiError } = useApiNotifier();
    const {
    warning: showWarning,
    info: showInfo,
  } = useNotifications();
  
  const fetchSuppliers = async () => {
    try{
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/supplier`);
      setSuppliers(res.data);
      if(res.data.length === 0){
        showInfo({
          title: "No suppliers found",
          message: "There are no suppliers registered yet.",
        });
      }
    }catch(err){
      appLogger.error("Error fetching suppliers", err);
      notifyApiError(err, {
        title: "Fetch failed",
        fallbackMessage: "Unable to fetch suppliers right now.",
      });
    } finally {
      setLoading(false);
    }
  }

   useEffect(() => {
      fetchSuppliers();
    }, []);


  return (
    <div className="admin-user-tab">
      <div className="admin-user-card">
        <div className="admin-user-toolbar">
          <div className="admin-user-toolbar-left">
            <button
              className="admin-user-tool-btn"
             
            >
              <Plus size={16} />
              Add Supplier
            </button>
            <button
              className="admin-user-tool-btn"
              onClick={fetchSuppliers}
              disabled={loading}
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
      {loading ? (
        <div>Loading suppliers...</div>
      ) : (
        <div>
         <table>
            <thead>
              <tr>
                <th>Name</th> 
                <th>Contact Person</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr key={supplier.supplier_id}>
                  <td>{supplier.name}</td>
                  <td>{supplier.contact_person}</td>
                  <td>{supplier.email}</td>
                  <td>{supplier.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
