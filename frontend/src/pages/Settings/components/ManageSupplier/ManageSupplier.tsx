import { Plus, RefreshCw, Search } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { appLogger } from "../../../../utils/logger";
import {
  useApiNotifier,
  useNotifications,
} from "../../../../components/common";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
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
  const { warning: showWarning, info: showInfo } = useNotifications();
   const itemsPerPage = 5;
   const [currentPage, setCurrentPage] = useState(1);
   const [searchName, setSearchName] = useState("");


   //get suppliers
  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/supplier`);
      setSuppliers(res.data);
      if (res.data.length === 0) {
        showInfo({
          title: "No suppliers found",
          message: "There are no suppliers registered yet.",
        });
      }
    } catch (err) {
      appLogger.error("Error fetching suppliers", err);
      notifyApiError(err, {
        title: "Fetch failed",
        fallbackMessage: "Unable to fetch suppliers right now.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  //handle pagination

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };


  //search supplier implementation
  const handleSearch = () => {
    setCurrentPage(1);
  };

  const filteredSuppliers = suppliers.filter((supplier) => {
    const nameMatch = supplier.name
      .toLowerCase()
      .includes(searchName.toLowerCase());
    return nameMatch;
  });


  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSuppliers = filteredSuppliers.slice(startIndex, endIndex);



  return (
    <div className="admin-user-tab">
      <div className="admin-user-card">
        <div className="admin-user-toolbar">
          <div className="admin-user-toolbar-left">
            <button className="admin-user-tool-btn">
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
              <input type="text" placeholder="Search by Name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
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
              {paginatedSuppliers.map((supplier) => (
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
      <div className="admin-user-pagination">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          Previous
        </button>
        <span className="pagination-info">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="pagination-btn"
        >
          Next
        </button>
      </div>
    </div>
  );
}
