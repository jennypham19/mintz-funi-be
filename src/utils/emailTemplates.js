const getWelcomeEmailTemplate = (fullName,username, tempPassword, loginUrl) => `
<table style="max-width:600px;margin:auto;border-collapse:collapse;font-family:Arial,sans-serif">
  <tr>
    <td style="background:#1C1A1B;padding:20px;text-align:center;color:white">
      <h2>Mintz Furniture Management</h2>
    </td>
  </tr>
  <tr>
    <td style="padding:20px">
      <p>Xin chào <b>${fullName}</b>,</p>
      <p>Tài khoản của bạn đã được tạo trên hệ thống quản lý Mintz.</p>
      <p><b>Tài khoản:</b> <span style="color:#007bff">${username}</span></p>
      <p><b>Mật khẩu tạm thời:</b> <span style="color:#007bff">${tempPassword}</span></p>
      <p>Vui lòng đăng nhập và đổi mật khẩu ngay để đảm bảo bảo mật.</p>
      <div style="text-align:center;margin:20px 0">
        <a href="${loginUrl}" style="background:#28a745;color:white;padding:12px 20px;text-decoration:none;border-radius:5px;display:inline-block">Đăng nhập ngay</a>
      </div>
      <p>Nếu bạn không thực hiện yêu cầu này, vui lòng liên hệ bộ phận IT.</p>
      <p>Trân trọng,<br>Đội ngũ Mintz</p>
    </td>
  </tr>
  <tr>
    <td style="background:#f1f1f1;padding:10px;text-align:center;font-size:12px;color:#666">
      © 2025 Mintz Furniture Management. All rights reserved.
    </td>
  </tr>
</table>
`;

module.exports = {
  getWelcomeEmailTemplate
}