class ReleasesController < ApplicationController

  def release
    app = App.find_by!(uid: params[:app_id])
    Releases::CreateCommand.execute(build_uid: params[:build_uid])
    flash[:info] = 'Release created'
    redirect_to app_path(app.uid)
  rescue ValidationError => e
    flash[:error] = e.errors
    redirect_to app_path(app.uid)
  end

  def promote
    app = App.find_by!(uid: params[:app_id])

    Builds::PromoteCommand.execute(
      source_build_uid: params[:build_uid],
      target_stage_uid: params[:stage_uid],
    )

    flash[:info] = 'Promoted'
    redirect_to app_path(app.uid)
  rescue ValidationError => e
    flash[:error] = e.errors
    redirect_to app_path(app.uid)
  end

  def rollback
    app = App.find_by!(uid: params[:app_id])
    Releases::CreateCommand.execute(build_uid: params[:build_uid])
    flash[:info] = 'Release created'
    redirect_to app_path(app.uid)
  rescue ValidationError => e
    flash[:error] = e.errors
    redirect_to app_path(app.uid)
  end

  def remove
    app = App.find_by!(uid: params[:app_id])
    Releases::DeleteCommand.execute(target_release_uid: params[:release_uid])
    flash[:info] = 'Release removed'
    redirect_to app_path(app.uid)
  rescue ValidationError => e
    flash[:error] = e.errors
    redirect_to app_path(app.uid)
  end

end
