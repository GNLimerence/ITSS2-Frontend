import React, { useState, useEffect } from "react";
import "./JobFilter.css";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from "axios";

const JobFilter = ({ onFilterChange, initialFilters = {} }) => {
  // State cho sections mở rộng
  const [expanded, setExpanded] = useState({
    jobType: true,
    workTime: true,
    jobPosition: true
  });
  
  // State cho bộ lọc
  const [filters, setFilters] = useState({
    jobType: initialFilters.jobType || [],
    category: initialFilters.category || [],
    jobForm: initialFilters.jobForm || [],
    days: initialFilters.days || [],
    minSalary: initialFilters.minSalary || "",
    maxSalary: initialFilters.maxSalary || "",
    available: initialFilters.available || []
  });
  
  // State cho dữ liệu từ API
  const [categories, setCategories] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [jobForms, setJobForms] = useState([]);
  
  // Fetch dữ liệu phân loại từ API
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        // Tạm thời sử dụng mẫu vì không có API lấy danh sách loại công việc
        setJobTypes([
          { name: "Freelancer" },
          { name: "Full-Time" },
          { name: "Part-Time" }
        ]);
        
        setJobForms([
          { name: "Tất cả" },
          { name: "Internship" },
          { name: "Contract" },
          { name: "Làm thêm" }
        ]);
        
        setCategories([
          { name: "Tất cả" },
          { name: "Nhân viên bán hàng" },
          { name: "Gia sư" },
          { name: "Design" },
          { name: "Sales" }
        ]);
        
        
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu bộ lọc:", error);
      }
    };
    
    fetchFilterData();
  }, []);
  
  // Xử lý khi toggle section
  const toggleSection = (section) => {
    setExpanded({
      ...expanded,
      [section]: !expanded[section]
    });
  };
  
  // Xử lý khi thay đổi loại công việc
  const handleJobTypeChange = (type) => {
    let newJobTypes = [...(filters.jobType || [])];
    
    if (newJobTypes.includes(type)) {
      // Nếu đã chọn, bỏ chọn
      newJobTypes = newJobTypes.filter(item => item !== type);
      
      // Nếu loại bỏ Part-Time, cũng xóa tất cả các ngày đã chọn
      if (type === "Part-Time") {
        const newFilters = { 
          ...filters, 
          jobType: newJobTypes,
          days: [],
          available: []
        };
        setFilters(newFilters);
        onFilterChange(newFilters);
        return;
      }
    } else {
      // Nếu chưa chọn, thêm vào
      newJobTypes.push(type);
    }
    
    const newFilters = { ...filters, jobType: newJobTypes };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  // Xử lý khi thay đổi vị trí công việc (category)
  const handleCategoryChange = (category) => {
    let newCategories = [...(filters.category || [])];
    
    if (category === "Tất cả") {
      // Nếu chọn "Tất cả", xóa hết các lựa chọn khác
      newCategories = ["Tất cả"];
    } else {
      // Nếu đã có "Tất cả", xóa nó đi
      if (newCategories.includes("Tất cả")) {
        newCategories = newCategories.filter(item => item !== "Tất cả");
      }
      
      if (newCategories.includes(category)) {
        newCategories = newCategories.filter(item => item !== category);
      } else {
        newCategories.push(category);
      }
      
      // Nếu không còn lựa chọn nào, thêm lại "Tất cả"
      if (newCategories.length === 0) {
        newCategories = ["Tất cả"];
      }
    }
    
    const newFilters = { ...filters, category: newCategories };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  // Xử lý khi thay đổi hình thức công việc (jobForm)
  const handleJobFormChange = (form) => {
    let newJobForms = [...(filters.jobForm || [])];
    
    if (form === "Tất cả") {
      // Nếu chọn "Tất cả", xóa hết các lựa chọn khác
      newJobForms = ["Tất cả"];
    } else {
      // Nếu đã có "Tất cả", xóa nó đi
      if (newJobForms.includes("Tất cả")) {
        newJobForms = newJobForms.filter(item => item !== "Tất cả");
      }
      
      if (newJobForms.includes(form)) {
        newJobForms = newJobForms.filter(item => item !== form);
      } else {
        newJobForms.push(form);
      }
      
      // Nếu không còn lựa chọn nào, thêm lại "Tất cả"
      if (newJobForms.length === 0) {
        newJobForms = ["Tất cả"];
      }
    }
    
    const newFilters = { ...filters, jobForm: newJobForms };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  // Xử lý khi thay đổi ngày làm việc
  const handleDayChange = (day) => {
    let newDays = [...(filters.days || [])];
    
    if (newDays.includes(day)) {
      // Xóa ngày
      newDays = newDays.filter(item => item !== day);
      
      // Đồng thời xóa tất cả các ca liên quan đến ngày này
      let newSchedule = [...(filters.available || [])];
      newSchedule = newSchedule.filter(item => !item.startsWith(`${day}-`));
      
      const newFilters = { 
        ...filters, 
        days: newDays,
        available: newSchedule 
      };
      setFilters(newFilters);
      onFilterChange(newFilters);
    } else {
      // Thêm ngày
      newDays.push(day);
      
      const newFilters = { ...filters, days: newDays };
      setFilters(newFilters);
      onFilterChange(newFilters);
    }
  };
  
  // Xử lý khi thay đổi lịch trình làm việc (thứ + ca)
  const handleScheduleChange = (day, period) => {
    const scheduleItem = `${day}-${period}`;
    let newSchedule = [...(filters.available || [])];
    
    if (newSchedule.includes(scheduleItem)) {
      newSchedule = newSchedule.filter(item => item !== scheduleItem);
    } else {
      newSchedule.push(scheduleItem);
    }
    
    const newFilters = { ...filters, available: newSchedule };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  // Xử lý khi thay đổi mức lương
  const handleSalaryChange = (type, value) => {
    const newFilters = { 
      ...filters, 
      [type]: value 
    };
    setFilters(newFilters);
  };
  
  // Xử lý khi nhấn nút Lọc
  const handleFilter = () => {
    onFilterChange(filters);
  };
  
  // Xử lý khi nhấn nút Xóa tất cả
  const handleClearAll = () => {
    const emptyFilters = {
      jobType: [],
      category: ["Tất cả"],
      jobForm: ["Tất cả"],
      days: [],
      minSalary: "",
      maxSalary: "",
      available: []
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };
  
  // Kiểm tra xem thứ có được chọn không
  const isDaySelected = (day) => {
    return Array.isArray(filters.days) && filters.days.includes(day);
  };
  
  // Kiểm tra xem ca trong thứ có được chọn không
  const isPeriodSelected = (day, period) => {
    return Array.isArray(filters.available) && filters.available.includes(`${day}-${period}`);
  };

  // Kiểm tra xem Part-Time có được chọn
  const isPartTimeSelected = () => {
    return Array.isArray(filters.jobType) && filters.jobType.includes("Part-Time");
  };

  return (
    <div className="filter-outer-container">
      <div className="filter-header-outer">
        <h3 className="filter-title">Bộ lọc</h3>
        <button className="clear-all-btn" onClick={handleClearAll}>Xóa tất cả</button>
      </div>
      
      <div className="job-filter">
        {/* Salary Range */}
        <div className="filter-section">
          <h4 className="section-title">Mức Lương</h4>
          <div className="salary-range">
            <input 
              type="text" 
              placeholder="Từ" 
              className="salary-input" 
              value={filters.minSalary}
              onChange={(e) => handleSalaryChange("minSalary", e.target.value)}
            />
            <input 
              type="text" 
              placeholder="Đến" 
              className="salary-input" 
              value={filters.maxSalary}
              onChange={(e) => handleSalaryChange("maxSalary", e.target.value)}
            />
          </div>
        </div>
        
        <div className="section-divider"></div>
        
        {/* Job Form */}
        <div className="filter-section">
          <div className="section-header" onClick={() => toggleSection("jobType")}>
            <h4 className="section-title">Hình thức công việc</h4>
            <ExpandMoreIcon className={`expand-icon ${expanded.jobType ? "" : "rotated"}`} />
          </div>
          
          {expanded.jobType && (
            <div className="section-content">
              {jobForms.map((form, index) => (
                <div className="checkbox-item" key={index}>
                  <input 
                    type="checkbox" 
                    id={`form-${index}`} 
                    checked={Array.isArray(filters.jobForm) && filters.jobForm.includes(form.name)}
                    onChange={() => handleJobFormChange(form.name)}
                  />
                  <label htmlFor={`form-${index}`}>{form.name}</label>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="section-divider"></div>
        
        {/* Work Time */}
        <div className="filter-section">
          <div className="section-header" onClick={() => toggleSection("workTime")}>
            <h4 className="section-title">Thời gian làm việc</h4>
            <ExpandMoreIcon className={`expand-icon ${expanded.workTime ? "" : "rotated"}`} />
          </div>
          
          {expanded.workTime && (
            <div className="section-content">
              {jobTypes.map((type, index) => (
                <div className="checkbox-item" key={index}>
                  <input 
                    type="checkbox" 
                    id={`type-${index}`} 
                    checked={Array.isArray(filters.jobType) && filters.jobType.includes(type.name)}
                    onChange={() => handleJobTypeChange(type.name)}
                  />
                  <label htmlFor={`type-${index}`}>{type.name}</label>
                </div>
              ))}
              
              {/* Hiển thị danh sách các ngày trong tuần chỉ khi Part-Time được chọn */}
              {isPartTimeSelected() && (
                <div className="nested-options">
                  {/* Danh sách các ngày trong tuần */}
                  {["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"].map((day, index) => (
                    <React.Fragment key={index}>
                      <div className="checkbox-item nested-item">
                        <input 
                          type="checkbox" 
                          id={`day-${index}`} 
                          checked={isDaySelected(day)}
                          onChange={() => handleDayChange(day)}
                        />
                        <label htmlFor={`day-${index}`}>{day}</label>
                      </div>
                      
                      {/* Hiển thị các ca trong ngày nếu ngày được chọn */}
                      {isDaySelected(day) && (
                        <div className="double-nested-options">
                          {["sáng", "chiều", "tối"].map((period, periodIndex) => (
                            <div className="checkbox-item double-nested-item" key={periodIndex}>
                              <input 
                                type="checkbox" 
                                id={`period-${index}-${periodIndex}`} 
                                checked={isPeriodSelected(day, period)}
                                onChange={() => handleScheduleChange(day, period)}
                              />
                              <label htmlFor={`period-${index}-${periodIndex}`}>Ca {period}</label>
                            </div>
                          ))}
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="section-divider"></div>
        
        {/* Job Position */}
        <div className="filter-section">
          <div className="section-header" onClick={() => toggleSection("jobPosition")}>
            <h4 className="section-title">Vị trí công việc</h4>
            <ExpandMoreIcon className={`expand-icon ${expanded.jobPosition ? "" : "rotated"}`} />
          </div>
          
          {expanded.jobPosition && (
            <div className="section-content">
              {categories.map((category, index) => (
                <div className="checkbox-item" key={index}>
                  <input 
                    type="checkbox" 
                    id={`category-${index}`} 
                    checked={Array.isArray(filters.category) && filters.category.includes(category.name)}
                    onChange={() => handleCategoryChange(category.name)}
                  />
                  <label htmlFor={`category-${index}`}>{category.name}</label>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="section-divider"></div>
        
        <button className="collapse-button">Thu hẹp</button>
      </div>
      
      <button className="filter-btn" onClick={handleFilter}>Lọc</button>
    </div>
  );
};

export default JobFilter;