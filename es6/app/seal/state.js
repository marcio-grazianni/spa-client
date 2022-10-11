import {monkey} from 'baobab'

const seal = {
  message_seal: {},
  expanded: {
    sites: true,
    edit: true,
    code: true,
  },
  copied: false,
  seal_code: monkey({
    cursors: {
      message_seal: ['seal', 'message_seal'],
      account_slug: ['account', 'account_slug'],
    },
    get: (state) => {
      let code = "";
      if (!(state.message_seal)) {
        return "";
      }
      const {format, icon, border, call_to_action, uuid, id} = state.message_seal;
      let sealStyle = "padding:0;background:#ffffff";
      if (border !== 'none') {
        sealStyle += ";border:2px solid #e5e5e5";
      }
      if (format === 'horizontal') {
        sealStyle += ";min-height:80px";
      }
      const iconSrc =  `${Django.S3_url}/seal-images/${icon}.jpg`;
      if (format === 'vertical') {
        code = `<table style='${sealStyle}' width='100%' cellpadding='0' cellspacing='0' align='100%'>
<tbody>
<tr width='100%' style='padding:0'>
<td width='100%' align='center' style='padding:0'>
<a href='${Django.base_url + Django.url('reviews:testimonial_give_review', state.account_slug)}' style='text-decoration:none;padding-top:14px;display:block;' target='_blank'>
<h2 style='font-size:20px; line-height:22px; margin:0; color:#868686 !important; font-family:Arial, sans-serif; text-align: center;'>${call_to_action}</h2>
<span style='display:block; width:100%'>
<img src='${iconSrc}' style='width:130px;max-width:130px' alt='${call_to_action}' border='0' hspace='0' vspace='0'/>
</span>
<span style='display:block; width:100%; padding-bottom:8px'>
<img src='${Django.static('images/seal.jpg')}' style='width:150px;max-width:150px' border='0' hspace='0' vspace='0'/>
</span>
</a>
</td>
</tr>
</tbody>
</table>`
      } else {
        code = `<table style='${sealStyle}' width='100%' cellpadding='0' cellspacing='0' align='100%'>
<tbody>
<tr width='100%' style='padding:0'>
<td width='50%' align='center' style='padding:0'>
<div style='width:100%;padding:0 2%'>
<a href='${Django.base_url + Django.url('reviews:testimonial_give_review', state.account_slug)}' style='text-decoration:none;padding-top:10px;display:block;' target='_blank'>
<h2 style='font-size:20px; line-height:22px; margin:0; color:#868686 !important; font-family:Arial, sans-serif; text-align: center;'>${call_to_action}</h2>
<img src='${iconSrc}' style='width:130px;max-width:130px;'alt='${call_to_action}' border='0' hspace='0' vspace='0'/>
</a>
</div>
</td>
<td width='50%' align='center' style='padding:0;'>
<div style='width:100%;'>
<a href='${Django.base_url + Django.url('reviews:testimonial_give_review', state.account_slug)}' style='text-decoration:none;padding:0;display:block;' target='_blank'>
<img src='${Django.static('images/seal.jpg')}' style='max-width:84%;max-height:74px;' border='0' hspace='0' vspace='0'/>
</a>
</div>
</td>
</tr>
</tbody>
</table>`
      }
      return code
    },
  }),
}

export default seal;